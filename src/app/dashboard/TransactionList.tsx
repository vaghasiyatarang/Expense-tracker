"use client";
import { format } from "date-fns";
import MarkSettledButton from "./MarkSettledButton";
import TransactionFilters from "./TransactionFilters";
import ExportPDFButton from "components/ExportPDFButton";
import ExportExcelButton from "components/ExportExcelButton";

type Props = {
  transactions: any[];
  query: {
    type?: string;
    status?: string;
    q?: string;
  };
};
export default function TransactionList({ transactions, query }: Props) {
  const filtered = transactions.filter((tx) => {
    if (query.type && tx.type !== query.type) return false;
    if (query.status && tx.status !== query.status) return false;
    if (query.q && !tx.person.toLowerCase().includes(query.q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-700">
          Borrow / Lend Records
        </h2>
        <div className="flex gap-2">
          <ExportExcelButton
            data={transactions} // or transactions
            fileName="transactions.xlsx"
            label="Export as Excel"
          />

          <ExportPDFButton
            targetId="transaction-list"
            fileName="transactions.pdf"
          />
        </div>
      </div>

      <TransactionFilters currentQuery={query} />

      <div id="transaction-list">
        {transactions.length === 0 ? (
          <p className="text-gray-500 mt-4">No matching records found.</p>
        ) : (
          <table className="min-w-full text-sm table-auto mt-4">
            <thead className="text-indigo-600 text-left border-b">
              <tr>
                <th className="py-2 pr-4">Person</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Due</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr
                  key={tx._id}
                  className="border-b last:border-none hover:bg-indigo-50/30"
                >
                  <td className="py-2 pr-4">{tx.person}</td>
                  <td className="py-2 pr-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === "borrow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4 font-semibold text-gray-800">
                    ₹ {tx.amount.toFixed(2)}
                  </td>
                  <td className="py-2 pr-4 text-gray-600">
                    {tx.dueDate
                      ? format(new Date(tx.dueDate), "dd MMM yyyy")
                      : "-"}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        tx.status === "settled"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    {tx.status === "pending" && (
                      <MarkSettledButton transactionId={tx._id.toString()} />
                    )}
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
