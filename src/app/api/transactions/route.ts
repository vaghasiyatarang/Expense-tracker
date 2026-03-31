import { authOptions } from "auth/authOptions";
import { connectToDatabase } from "lib/mongo";
import { Transaction } from "models/Transaction";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, person, amount, reason, dueDate } = body;

  if (!type || !person || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectToDatabase();

  const transaction = await Transaction.create({
    userId: session.user.id,
    type,
    person,
    amount,
    reason,
    dueDate,
  });

  return NextResponse.json({ transaction }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();

  const transactions = await Transaction.find({ userId: session.user.id }).sort({ date: -1 });

  return NextResponse.json(transactions);
}
