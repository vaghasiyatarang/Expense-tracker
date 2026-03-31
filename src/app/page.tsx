"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">📊 Expense Tracker</h1>
            <p className="text-slate-400">Manage your finances with ease</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 font-bold text-lg">✓</span>
              <div>
                <p className="text-white font-semibold">Track Expenses</p>
                <p className="text-slate-400 text-sm">Monitor your spending in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 font-bold text-lg">✓</span>
              <div>
                <p className="text-white font-semibold">Manage Transactions</p>
                <p className="text-slate-400 text-sm">Organize and categorize your transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 font-bold text-lg">✓</span>
              <div>
                <p className="text-white font-semibold">Export Reports</p>
                <p className="text-slate-400 text-sm">Generate PDF and Excel reports</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            © 2024 Expense Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
