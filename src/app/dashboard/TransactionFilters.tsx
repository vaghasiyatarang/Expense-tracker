"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  currentQuery: {
    type?: string;
    status?: string;
    q?: string;
  };
};

export default function TransactionFilters({ currentQuery }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [type, setType] = useState(searchParams.get("type") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (q) params.set("q", q);

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
    >
      <input
        className="px-3 py-2 border rounded"
        placeholder="Search by person"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="px-3 py-2 border rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="borrow">Borrow</option>
        <option value="lend">Lend</option>
      </select>

      <select
        className="px-3 py-2 border rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="settled">Settled</option>
      </select>

      <button
        type="submit"
        className="col-span-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 transition"
      >
        Apply Filters
      </button>
    </form>
  );
}
