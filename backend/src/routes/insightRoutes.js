// backend/src/routes/insightRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { getMonthlySummary } from "../services/summaryService.js";

const router = express.Router();

router.get("/monthly", auth, async (req, res) => {
    try {
        const { year, month } = req.query;
        const y = Number(year);
        const m = Number(month);

        const summary = await getMonthlySummary(req.user._id, y, m);
        const insights = [];

        const { totalDebit, totalCredit, net, byCategory, topCreditSources, topDebitDestinations, txCount } =
            summary;

        if (!txCount) {
            return res.json({
                summary,
                insights: ["No transactions found for this month."],
            });
        }

        // Basic flow
        insights.push(
            `You had ${txCount} transactions this month with total inflow of ₹${totalCredit.toFixed(
                0
            )} and total outflow of ₹${totalDebit.toFixed(0)}.`
        );

        // Income side
        if (topCreditSources.length) {
            const topIncome = topCreditSources[0];
            insights.push(
                `Most of your money came from “${topIncome.name}” (₹${topIncome.amount.toFixed(
                    0
                )}).`
            );
            if (topCreditSources.length > 1) {
                const othersTotal = topCreditSources
                    .slice(1)
                    .reduce((s, t) => s + t.amount, 0);
                insights.push(
                    `Other major income sources together contributed around ₹${othersTotal.toFixed(
                        0
                    )}.`
                );
            }
        }

        // Expense side
        if (totalDebit > 0) {
            const catEntries = Object.entries(byCategory).sort(
                (a, b) => b[1] - a[1]
            );
            if (catEntries.length) {
                const [topCat, topCatAmt] = catEntries[0];
                const pct = ((topCatAmt / totalDebit) * 100).toFixed(1);
                insights.push(
                    `Your highest spend category is ${topCat} (₹${topCatAmt.toFixed(
                        0
                    )}, ${pct}% of your total spending).`
                );
            }

            if (topDebitDestinations.length) {
                const topOut = topDebitDestinations[0];
                insights.push(
                    `You spent the most money at “${topOut.name}” (₹${topOut.amount.toFixed(
                        0
                    )}).`
                );
            }

            // Savings / burn
            if (net < 0) {
                insights.push(
                    `You overspent by ₹${Math.abs(net).toFixed(
                        0
                    )} this month (net cash flow negative). Try cutting 10–15% in your top categories.`
                );
            } else if (net > 0) {
                insights.push(
                    `You saved around ₹${net.toFixed(
                        0
                    )} this month (net cash flow positive). Consider moving this into a savings/investment account.`
                );
            }
        } else {
            insights.push(
                "You have only incoming transactions and almost no spends tracked this month."
            );
        }

        res.json({ summary, insights });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load insights" });
    }
});

export default router;
