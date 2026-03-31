"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  amount: z.number().positive("Enter valid amount"),
  category: z.string().min(1, "Required"),
  notes: z.string().optional(),
  date: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

export default function AddExpenseForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/expenses", {
        ...data,
        amount: parseFloat(data.amount.toString()),
      });
      reset();
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-indigo-700">Add New Expense</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-red-500 mt-1">{errors.amount?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          {...register("category")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <p className="text-xs text-red-500 mt-1">{errors.category?.message}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Note</label>
        <input
          {...register("notes")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          {...register("date")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-red-500 mt-1">{errors.date?.message}</p>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-medium"
      >
        Add Expense
      </button>
    </form>
  );
}
