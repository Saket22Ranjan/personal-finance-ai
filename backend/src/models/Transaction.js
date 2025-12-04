import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        description: { type: String },
        amount: { type: Number, required: true },
        type: { type: String, enum: ["debit", "credit"], required: true },
        category: { type: String, default: "Uncategorized" },
        merchant: { type: String },
        raw: { type: Object } // full row from CSV if needed
    },
    { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
