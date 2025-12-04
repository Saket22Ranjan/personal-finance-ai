// backend/src/services/summaryService.js
import { Transaction } from "../models/Transaction.js";

export const getMonthlySummary = async (userId, year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const txns = await Transaction.find({
        user: userId,
        date: { $gte: start, $lte: end },
    });

    // Basic totals
    let totalDebit = 0;
    let totalCredit = 0;

    const byCategory = {};
    const byDate = {};

    const creditSources = {};       // income side
    const debitDestinations = {};   // expense side

    txns.forEach((t) => {
        const amt = t.amount || 0;
        const dKey = t.date.toISOString().slice(0, 10);
        const cat = t.category || "Uncategorized";
        const label = t.description || t.merchant || "Unknown";

        // totals by type
        if (t.type === "debit") {
            totalDebit += amt;
            debitDestinations[label] = (debitDestinations[label] || 0) + amt;
        } else if (t.type === "credit") {
            totalCredit += amt;
            creditSources[label] = (creditSources[label] || 0) + amt;
        }

        // by category (only expenses, usually more interesting)
        if (t.type === "debit") {
            byCategory[cat] = (byCategory[cat] || 0) + amt;
        }

        // by date: we count net cash movement (credits – debits)
        const signedAmt = t.type === "debit" ? -amt : amt;
        byDate[dKey] = (byDate[dKey] || 0) + signedAmt;
    });

    const net = totalCredit - totalDebit;

    const toSortedArray = (obj, limit = 5) =>
        Object.entries(obj)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);

    const topCreditSources = toSortedArray(creditSources, 5);
    const topDebitDestinations = toSortedArray(debitDestinations, 5);

    return {
        totalDebit,
        totalCredit,
        net,
        byCategory,
        byDate,
        topCreditSources,
        topDebitDestinations,
        txCount: txns.length,
    };
};
