import mongoose, { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, required: true }
});

export const Expense = models.Expense || model("Expense", ExpenseSchema);
