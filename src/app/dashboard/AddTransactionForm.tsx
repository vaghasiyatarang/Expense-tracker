"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  type: z.enum(["borrow", "lend"]),
  person: z.string().min(1, "Name is required"),
  amount: z.number().positive("Amount must be > 0"),
  reason: z.string().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddTransactionForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/transactions", {
        ...data,
        amount: parseFloat(data.amount.toString()),
      });
      reset();
      router.refresh(); // reload list
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-5"
    >
      <h2 className="text-xl font-semibold text-indigo-700">Record Borrow/Lend</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-gray-700">Type</label>
        <select
          {...register("type")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">Select</option>
          <option value="borrow">Borrowed</option>
          <option value="lend">Lent</option>
        </select>
        <p className="text-xs text-red-500">{errors.type?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Person</label>
        <input
          {...register("person")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
          placeholder="Name of person"
        />
        <p className="text-xs text-red-500">{errors.person?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <p className="text-xs text-red-500">{errors.amount?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Reason (optional)</label>
        <input
          {...register("reason")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          {...register("dueDate")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-medium"
      >
        Save Transaction
      </button>
    </form>
  );
}
