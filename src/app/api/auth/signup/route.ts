import bcrypt from "bcryptjs";
import { connectToDatabase } from "lib/mongo";
import { User } from "models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return NextResponse.json({
    message: "User created",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  }, { status: 201 });
}
