"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkSettledButton({
  transactionId,
}: {
  transactionId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSettle = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/transactions/${transactionId}`, {
        status: "settled",
      });
      router.refresh();
    } catch (error) {
      console.error("Error marking settled:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSettle}
      disabled={loading}
      className="text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
    >
      {loading ? "Processing..." : "Mark as Settled"}
    </button>
  );
}
