import { authOptions } from "auth/authOptions";
import { connectToDatabase } from "lib/mongo";
import { Expense } from "models/Expense";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { amount, category, notes, date } = body;

  if (!amount || !category || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectToDatabase();

  const expense = await Expense.create({
    userId: session.user.id,
    amount,
    category,
    notes,
    date: new Date(date),
  });

  return NextResponse.json({ success: true, expense }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();

  const expenses = await Expense.find({ userId: session.user.id }).sort({ date: -1 });

  return NextResponse.json(expenses);
}
