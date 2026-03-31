import { authOptions } from "auth/authOptions";
import { connectToDatabase } from "lib/mongo";
import { Transaction } from "models/Transaction";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const { status } = await req.json();

  // ✅ Extract transaction ID from the URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // gets the [id] from /api/transactions/[id]

  if (!id) {
    return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
  }

  await Transaction.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: { status } }
  );

  return NextResponse.json({ success: true });
}