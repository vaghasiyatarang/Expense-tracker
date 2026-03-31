"use client";

type Props = {
  summary: {
    spent: number;
    borrowed: number;
    lent: number;
  };
};

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Spent (This Month)",
      value: `₹ ${summary.spent.toFixed(2)}`,
      bg: "bg-indigo-600",
    },
    {
      label: "Total Borrowed",
      value: `₹ ${summary.borrowed.toFixed(2)}`,
      bg: "bg-yellow-500",
    },
    {
      label: "Total Lent",
      value: `₹ ${summary.lent.toFixed(2)}`,
      bg: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} text-white p-4 rounded-xl shadow-md`}
        >
          <p className="text-sm">{card.label}</p>
          <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}
