import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltersCard from "./FiltersCard";
import StatsCardSection from "./StatsCardSection";
import TransactionOverviewTab from "./TransactionOverviewTab";
import AllTransactionsTab from "./AllTransactionsTab";
import {
  Category,
  Transaction,
  TransactionFilters as Filters,
  TransactionSort,
} from "@/types/transaction";

interface DashboardContentProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  sortedTransactions: Transaction[];
  filters: Filters;
  sort: TransactionSort;
  categories: Category[];
  availableMonths: { value: string; label: string }[];
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topIncomes: Transaction[];
  topExpenses: Transaction[];
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: TransactionSort) => void;
  onCloseFile: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  transactions,
  filteredTransactions,
  sortedTransactions,
  filters,
  sort,
  categories,
  availableMonths,
  totalIncome,
  totalExpense,
  netBalance,
  topIncomes,
  topExpenses,
  onFiltersChange,
  onSortChange,
  onCloseFile,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <FiltersCard
        filters={filters}
        onFiltersChange={onFiltersChange}
        categories={categories}
        availableMonths={availableMonths}
        onCloseFile={onCloseFile}
      />

      {/* Stats Cards */}
      <StatsCardSection
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
      />

      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-lg bg-white border mb-6">
          <TabsTrigger
            value="combined"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Transactions
          </TabsTrigger>
        </TabsList>

        <TransactionOverviewTab
          filteredTransactions={filteredTransactions}
          topIncomes={topIncomes}
          topExpenses={topExpenses}
        />

        <AllTransactionsTab
          sortedTransactions={sortedTransactions}
          sort={sort}
          onSortChange={onSortChange}
        />
      </Tabs>
    </div>
  );
};

export default DashboardContent;
