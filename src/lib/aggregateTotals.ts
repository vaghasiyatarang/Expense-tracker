import { Expense } from "models/Expense";
import { Types } from "mongoose";

export async function getTotalsByCategory(userId: string) {
  const totals = await Expense.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return totals.map((item) => ({
    category: item._id,
    total: item.total,
  }));
}
