import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["borrow", "lend"], required: true },
  person: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ["pending", "settled"], default: "pending" },
  date: { type: Date, default: Date.now },
});

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);
