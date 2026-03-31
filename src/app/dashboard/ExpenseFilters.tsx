"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  currentQuery: {
    category?: string;
    q?: string;
    from?: string;
    to?: string;
  };
};

export default function ExpenseFilters({ currentQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState(currentQuery.category || "");
  const [q, setQ] = useState(currentQuery.q || "");
  const [from, setFrom] = useState(currentQuery.from || "");
  const [to, setTo] = useState(currentQuery.to || "");

  useEffect(() => {
    setCategory(currentQuery.category || "");
    setQ(currentQuery.q || "");
    setFrom(currentQuery.from || "");
    setTo(currentQuery.to || "");
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
    >
      <input
        className="px-3 py-2 border rounded"
        placeholder="Search notes"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        className="px-3 py-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
        <option value="shopping">Shopping</option>
        <option value="other">Other</option>
      </select>
      <input
        type="date"
        className="px-3 py-2 border rounded"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <input
        type="date"
        className="px-3 py-2 border rounded"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <button
        type="submit"
        className="col-span-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 transition"
      >
        Apply Filters
      </button>
    </form>
  );
}
