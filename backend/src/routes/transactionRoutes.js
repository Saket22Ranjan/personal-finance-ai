import express from "express";
import { parse } from "csv-parse/sync";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { Transaction } from "../models/Transaction.js";
import { categorizeTransaction } from "../services/categorizer.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

/** Safely push a transaction */
const pushTxn = (transactions, userId, t) => {
    if (!t.date) return;
    const d = new Date(t.date);
    if (isNaN(d)) return;

    if (t.amount == null || isNaN(t.amount)) return;

    transactions.push({
        user: userId,
        date: d,
        description: t.description || "",
        amount: Math.abs(t.amount),
        type: t.type,
        category: t.category,
        merchant: t.description ? t.description.split(" ")[0] : undefined,
        raw: t.raw,
    });
};

/** Parse SBI-style CSV (like 9903_...unlocked.csv) */
const parseSbiCsv = (rows) => {
    const txns = [];
    const dateRegex = /^\d{2}\s\w{3}\s\d{4}$/; // "04 Sep 2025"

    let i = 0;
    while (i < rows.length) {
        const row = rows[i];
        if (!row || !row.length) {
            i++;
            continue;
        }

        const c0 = row[0] ? row[0].trim() : "";
        const c1 = row[1] || "";
        const c3 = row[3] || "";
        const c4 = row[4] || "";

        // skip header rows like "Date,Details,Ref No./Cheque,Debit,Credit,Balance"
        if (c0 === "Date" && c1 === "Details") {
            i++;
            continue;
        }

        // a real txn line starts with a date like "04 Sep 2025"
        if (!dateRegex.test(c0)) {
            i++;
            continue;
        }

        let description = c1 || "";

        // optional continuation lines: same txn, first column empty, description in col1
        let j = i + 1;
        while (j < rows.length) {
            const next = rows[j];
            if (!next || !next.length) break;
            const n0 = next[0] ? next[0].trim() : "";
            const n1 = next[1] || "";

            if (n0) break; // next txn or header
            if (!n1) break;
            description += " " + n1;
            j++;
        }

        const cleanNum = (val) =>
            Number(String(val).replace(/[^\d.-]/g, "").trim());

        const debitStr = c3;
        const creditStr = c4;

        const debitAmt = cleanNum(debitStr);
        const creditAmt = cleanNum(creditStr);

        txns.push({
            date: c0,
            description,
            debitAmt: !isNaN(debitAmt) && debitStr && debitStr !== "-" ? debitAmt : 0,
            creditAmt:
                !isNaN(creditAmt) && creditStr && creditStr !== "-" ? creditAmt : 0,
            raw: rows.slice(i, j),
        });

        i = j;
    }

    return txns;
};

// ======================= UPLOAD ==========================
router.post(
    "/upload",
    auth,
    upload.single("file"),
    async (req, res) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const userId = req.user._id;
            const transactions = [];

            // ----------------- CSV / TEXT -----------------
            if (
                file.mimetype === "text/csv" ||
                file.mimetype === "application/vnd.ms-excel" ||
                file.mimetype === "text/plain"
            ) {
                const text = file.buffer.toString("utf-8");

                // Base row parse (no headers)
                const rows = parse(text, {
                    skip_empty_lines: false,
                    relax_column_count: true,
                    trim: true,
                });

                // 1️⃣ PhonePe-style detection (Date, Transaction Details, Type, Amount)
                const phonePeTxns = [];
                for (const row of rows) {
                    if (!row || !row.length) continue;
                    const [c0, c1, c2, c3] = row;
                    if (!c0 || c0 === "Date") continue;

                    const looksLikeDate = /^\w{3}\s\d{1,2},\s\d{4}$/.test(String(c0));
                    const hasAmount = c3 && /[0-9]/.test(String(c3));

                    if (!looksLikeDate || !hasAmount) continue;

                    const dateStr = c0;
                    const description = c1 || "";
                    const typeRaw = (c2 || "").toString().toUpperCase();
                    const type = typeRaw.includes("DEBIT") ? "debit" : "credit";

                    const amtNum = Number(
                        String(c3).replace(/[^\d.-]/g, "").trim()
                    );
                    if (isNaN(amtNum)) continue;

                    phonePeTxns.push({ dateStr, description, type, amtNum, raw: { row } });
                }

                if (phonePeTxns.length) {
                    // Use PhonePe parser
                    for (const t of phonePeTxns) {
                        const category = await categorizeTransaction(t.description);
                        pushTxn(transactions, userId, {
                            date: t.dateStr,
                            description: t.description,
                            amount: t.amtNum,
                            type: t.type,
                            category,
                            raw: t.raw,
                        });
                    }
                } else {
                    // 2️⃣ SBI-style detection
                    const sbiTxns = parseSbiCsv(rows);
                    if (sbiTxns.length) {
                        for (const t of sbiTxns) {
                            if (t.debitAmt > 0) {
                                const category = await categorizeTransaction(t.description);
                                pushTxn(transactions, userId, {
                                    date: t.date,
                                    description: t.description,
                                    amount: t.debitAmt,
                                    type: "debit",
                                    category,
                                    raw: t.raw,
                                });
                            }
                            if (t.creditAmt > 0) {
                                const category = await categorizeTransaction(t.description);
                                pushTxn(transactions, userId, {
                                    date: t.date,
                                    description: t.description,
                                    amount: t.creditAmt,
                                    type: "credit",
                                    category,
                                    raw: t.raw,
                                });
                            }
                        }
                    } else {
                        // 3️⃣ Generic header-based CSV fallback (other banks/wallets)
                        let records;
                        try {
                            records = parse(text, {
                                columns: true,
                                skip_empty_lines: true,
                                trim: true,
                                relax_column_count: true,
                            });
                        } catch (err) {
                            console.error("CSV parse error:", err.message);
                            return res.status(400).json({
                                message: "Unable to parse CSV. Check format / separator.",
                                error: err.message,
                            });
                        }

                        for (const row of records) {
                            const keys = Object.keys(row);
                            if (!keys.length) continue;

                            const lowerKeys = keys.map((k) => k.toLowerCase());

                            // Date column
                            let dateKey =
                                keys[lowerKeys.findIndex((k) => k.includes("date"))] || null;

                            // Description column
                            let descKey =
                                keys[
                                lowerKeys.findIndex(
                                    (k) =>
                                        k.includes("description") ||
                                        k.includes("narration") ||
                                        k.includes("details") ||
                                        k.includes("remarks") ||
                                        k.includes("merchant")
                                )
                                ] || null;

                            // Amount column
                            let amountKey =
                                keys[
                                lowerKeys.findIndex(
                                    (k) =>
                                        k.includes("amount") ||
                                        k.includes("amt") ||
                                        k.includes("value")
                                )
                                ] || null;

                            const dateVal = dateKey ? row[dateKey] : null;
                            const description =
                                (descKey && row[descKey]) ||
                                row.Description ||
                                row.Narration ||
                                row["Transaction Details"] ||
                                row["Details"] ||
                                "";

                            let amtRaw =
                                (amountKey && row[amountKey]) ||
                                row.Amount ||
                                row["Amount (INR)"] ||
                                row["Debit"] ||
                                row["Credit"] ||
                                row["Amount (Dr.)"] ||
                                row["Amount (Cr.)"];

                            if (amtRaw === undefined || amtRaw === null || amtRaw === "") {
                                const numericKey = keys.find((k) =>
                                    String(row[k]).match(/^-?\d+(\.\d+)?$/)
                                );
                                if (numericKey) amtRaw = row[numericKey];
                            }

                            const amountNum = Number(
                                String(amtRaw || "").replace(/[^\d.-]/g, "").trim()
                            );
                            if (!amtRaw || isNaN(amountNum)) continue;

                            const typeField =
                                String(
                                    row.Type ||
                                    row["Txn Type"] ||
                                    row["Transaction Type"] ||
                                    row["Dr/Cr"]
                                ).toLowerCase();
                            let type;
                            if (typeField.includes("debit") || typeField.includes("dr")) {
                                type = "debit";
                            } else if (
                                typeField.includes("credit") ||
                                typeField.includes("cr")
                            ) {
                                type = "credit";
                            } else {
                                type = amountNum < 0 ? "debit" : "credit";
                            }

                            const category = await categorizeTransaction(description);

                            pushTxn(transactions, userId, {
                                date: dateVal,
                                description,
                                amount: amountNum,
                                type,
                                category,
                                raw: row,
                            });
                        }
                    }
                }
            }

            // ----------------- PDF -----------------
            else if (file.mimetype === "application/pdf") {
                const data = await pdfParse(file.buffer);
                const text = data.text || "";

                const lines = text
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean);

                for (const line of lines) {
                    const parts = line.split(/\s+/);
                    if (parts.length < 3) continue;

                    const dateStr = parts[0];
                    const amount = Number(
                        parts[parts.length - 1].replace(/[^\d.-]/g, "")
                    );
                    const description = parts.slice(1, -1).join(" ");

                    if (!isNaN(Date.parse(dateStr)) && !isNaN(amount)) {
                        const type = amount < 0 ? "debit" : "credit";
                        const category = await categorizeTransaction(description);

                        pushTxn(transactions, userId, {
                            date: dateStr,
                            description,
                            amount,
                            type,
                            category,
                            raw: { line },
                        });
                    }
                }
            } else {
                return res.status(400).json({ message: "Only CSV or PDF allowed" });
            }

            if (!transactions.length) {
                return res.status(400).json({
                    message:
                        "No valid transactions found. Try exporting a detailed statement (with date, description, amount).",
                });
            }

            // 🔥 Clear previous transactions for this user
            await Transaction.deleteMany({ user: userId });

            // Insert only latest upload
            await Transaction.insertMany(transactions);

            return res.json({
                message: "Uploaded successfully",
                count: transactions.length,
            });
        } catch (err) {
            console.error("UPLOAD ERROR:", err);
            return res.status(500).json({
                message: "Upload failed",
                error: err.message,
            });
        }
    }
);

router.get("/", auth, async (req, res) => {
    const txns = await Transaction.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(200);
    res.json(txns);
});

export default router;
