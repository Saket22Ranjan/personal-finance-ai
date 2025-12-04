import { Rule } from "../models/Rule.js";

const defaultKeywords = [
    { keyword: "SWIGGY", category: "Food" },
    { keyword: "ZOMATO", category: "Food" },
    { keyword: "OLA", category: "Travel" },
    { keyword: "UBER", category: "Travel" },
    { keyword: "MIAMI", category: "Nightlife" },
    { keyword: "RENT", category: "Rent" },
    { keyword: "NETFLIX", category: "Subscriptions" },
    { keyword: "SPOTIFY", category: "Subscriptions" },
    { keyword: "AMAZON", category: "Shopping" }
];

export const categorizeTransaction = async (description = "") => {
    const desc = description.toUpperCase();

    const rules = await Rule.find({});
    const allRules = [...rules, ...defaultKeywords];

    for (const rule of allRules) {
        if (desc.includes(rule.keyword.toUpperCase())) {
            return rule.category;
        }
    }

    if (desc.includes("POS") || desc.includes("CARD"))
        return "Card Spend";

    if (desc.includes("ATM")) return "Cash Withdrawal";

    return "Uncategorized";
};
