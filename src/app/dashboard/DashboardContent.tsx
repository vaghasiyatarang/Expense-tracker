"use client";
import AddExpenseForm from "./AddExpenseForm";
import AddTransactionForm from "./AddTransactionForm";
import ExpenseList from "./ExpenseList";
import SignOutButton from "./SignoutButton";
import TransactionList from "./TransactionList";
import SummaryCards from "./SummaryCards";

type Props = {
  userName: string;
  expenses: any[];
  transactions: any[];
  summary: { spent: number; borrowed: number; lent: number };
  searchParams: { [key: string]: string | string[] | undefined };
  categoryTotals: { category: string; total: number }[];
};

export default function DashboardContent({
  userName,
  expenses,
  transactions,
  summary,
  searchParams,
  categoryTotals,
}: Props) {
  
  // Client-side filtering logic:

  const getParam = (k: string) =>
    typeof searchParams[k] === "string"
      ? searchParams[k]
      : searchParams[k]?.[0];

  const expenseQuery = {
    category: getParam("category"),
    q: getParam("q"),
    from: getParam("from"),
    to: getParam("to"),
  };

  const transactionQuery = {
    type: getParam("type"),
    status: getParam("status"),
    q: getParam("q"),
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (expenseQuery.category && exp.category !== expenseQuery.category)
      return false;

    if (
      expenseQuery.q &&
      !exp.notes?.toLowerCase()?.includes(expenseQuery.q.toLowerCase())
    )
      return false;

    if (expenseQuery.from && new Date(exp.date) < new Date(expenseQuery.from))
      return false;

    if (expenseQuery.to && new Date(exp.date) > new Date(expenseQuery.to))
      return false;

    return true;
  });

  const filteredTransactions = transactions.filter((tx) => {
    if (transactionQuery.type && tx.type !== transactionQuery.type)
      return false;

    if (transactionQuery.status && tx.status !== transactionQuery.status)
      return false;

    if (
      transactionQuery.q &&
      !tx.person?.toLowerCase()?.includes(transactionQuery.q.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">
              Hi, {userName} 👋
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your expenses and stay financially aware.
            </p>
          </div>
          <SignOutButton />
        </header>

        <SummaryCards summary={summary} />

        {/* "Totals by Category" */}
        {categoryTotals.length > 0 && (
          <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              Totals by Category
            </h3>
            <ul className="space-y-2 text-sm">
              {categoryTotals.map((cat) => (
                <li
                  key={cat.category}
                  className="flex justify-between border-b pb-1 last:border-none"
                >
                  <span className="text-gray-700 capitalize">
                    {cat.category}
                  </span>
                  <span className="font-medium text-gray-800">
                    ₹ {cat.total.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddExpenseForm />
          <AddTransactionForm />
        </section>

        <section className="grid grid-cols-1 gap-6">
          <ExpenseList expenses={expenses} query={expenseQuery} />
          <TransactionList
            transactions={transactions}
            query={transactionQuery}
          />
        </section>
      </div>
    </div>
  );
}
