import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "auth/authOptions";
import DashboardContent from "./DashboardContent";
import { connectToDatabase } from "lib/mongo";
import { Expense } from "models/Expense";
import { Types } from "mongoose";
import { Transaction } from "models/Transaction";
import { startOfMonth } from "date-fns";
import { getTotalsByCategory } from "lib/aggregateTotals";

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams = {} }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectToDatabase();

  const userId = session.user.id;
  const name = (session.user.name ?? "User").split(" ")[0];

  // Fetch data
  const [expenses, transactions, summary, categoryTotals] = await Promise.all([
    Expense.find({ userId }).sort({ date: -1 }).lean(),
    Transaction.find({ userId }).sort({ date: -1 }).lean(),
    getSummary(userId),
    getTotalsByCategory(userId),
  ]);

  // Serialize for client
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <DashboardContent
      userName={name}
      expenses={serialize(expenses)}
      transactions={serialize(transactions)}
      summary={summary}
      searchParams={searchParams}  // Pass raw searchParams
      categoryTotals={categoryTotals}
    />
  );
}

async function getSummary(userId: string) {
  const thisMonth = startOfMonth(new Date());
  const userObjectId = new Types.ObjectId(userId);

  const [expenses, borrowTx, lendTx] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: userObjectId, date: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: userObjectId, type: "borrow", status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: userObjectId, type: "lend", status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    spent: expenses[0]?.total || 0,
    borrowed: borrowTx[0]?.total || 0,
    lent: lendTx[0]?.total || 0,
  };
}

