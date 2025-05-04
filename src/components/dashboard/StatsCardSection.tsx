import React from "react";
import StatCard from "@/components/StatCard";
import { ArrowUp, ArrowDown, BarChart } from "lucide-react";
import { formatCurrency } from "@/utils/transaction-utils";

interface StatsCardSectionProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

const StatsCardSection: React.FC<StatsCardSectionProps> = ({
  totalIncome,
  totalExpense,
  netBalance,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUp />}
        variant="income"
      />

      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpense)}
        icon={<ArrowDown />}
        variant="expense"
      />

      <StatCard
        title="Net Balance"
        value={formatCurrency(netBalance)}
        icon={<BarChart />}
        variant={netBalance >= 0 ? "income" : "expense"}
      />
    </div>
  );
};

export default StatsCardSection;
