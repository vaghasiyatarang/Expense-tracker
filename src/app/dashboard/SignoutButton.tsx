"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
    >
      Sign Out
    </button>
  );
}
