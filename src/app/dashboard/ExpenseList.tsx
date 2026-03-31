"use client";
import { format } from "date-fns";
import ExpenseFilters from "./ExpenseFilters";
import ExportPDFButton from "components/ExportPDFButton";
import ExportExcelButton from "components/ExportExcelButton";

type Props = {
  expenses: any[];
  query: {
    category?: string;
    q?: string;
    from?: string;
    to?: string;
  };
};

export default function ExpenseList({ expenses, query }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-700">
          Recent Expenses
        </h2>
        <div className="flex gap-2">
          <ExportExcelButton
            data={expenses} // or transactions
            fileName="expenses.xlsx"
            label="Export as Excel"
          />
          <ExportPDFButton targetId="expense-list" fileName="expenses.pdf" />
        </div>
      </div>

      <ExpenseFilters currentQuery={query} />

      <div id="expense-list">
        {expenses.length === 0 ? (
          <p className="text-gray-500 mt-4">No matching records found.</p>
        ) : (
          <table className="min-w-full text-sm table-auto mt-4">
            <thead className="text-indigo-600 text-left border-b">
              <tr>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Note</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp: any) => (
                <tr
                  key={exp._id}
                  className="border-b last:border-none hover:bg-indigo-50/40"
                >
                  <td className="py-2 pr-4">
                    {format(new Date(exp.date), "dd MMM yyyy")}
                  </td>
                  <td className="py-2 pr-4">{exp.category}</td>
                  <td className="py-2 pr-4 text-gray-600">
                    {exp.notes || "-"}
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-700">
                    ₹ {exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
