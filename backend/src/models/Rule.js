import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
    {
        keyword: { type: String, required: true }, // e.g. "SWIGGY"
        category: { type: String, required: true } // e.g. "Food"
    },
    { timestamps: true }
);

export const Rule = mongoose.model("Rule", ruleSchema);
