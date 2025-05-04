import React, { useState } from "react";
import {
  Transaction,
  TransactionFilters as Filters,
  TransactionSort,
} from "@/types/transaction";
import {
  calculateTotalExpense,
  calculateTotalIncome,
  calculateNetBalance,
  filterTransactions,
  getUniqueCategories,
  getTopTransactions,
  sortTransactions,
  getAvailableMonths,
} from "@/utils/transaction-utils";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "./dashboard/DashboardHeader";
import WelcomeScreen from "./dashboard/WelcomeScreen";
import DashboardContent from "./dashboard/DashboardContent";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({
    categories: null,
    excludeStartingPoint: false,
    dateRange: { from: undefined, to: undefined },
    priceRange: { min: undefined, max: undefined },
    searchTerm: "",
    transactionType: "all",
    month: null,
  });
  const [sort, setSort] = useState<TransactionSort>({
    field: "date",
    direction: "desc",
  });
  const { toast } = useToast();

  const handleDataLoaded = (data: Transaction[]) => {
    setTransactions(data);
  };

  const handleCloseFile = () => {
    if (transactions.length > 0) {
      setTransactions([]);
      toast({
        title: "File closed",
        description: "Transaction data has been cleared.",
      });
    }
  };

  const filteredTransactions = filterTransactions(transactions, filters);
  const sortedTransactions = sortTransactions(filteredTransactions, sort);
  const categories = getUniqueCategories(transactions);
  const totalExpense = calculateTotalExpense(filteredTransactions);
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const netBalance = calculateNetBalance(filteredTransactions);
  const availableMonths = getAvailableMonths(transactions);

  const topIncomes = getTopTransactions(filteredTransactions, "income", 5);
  const topExpenses = getTopTransactions(filteredTransactions, "expense", 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <DashboardHeader
        transactions={transactions}
        onDataLoaded={handleDataLoaded}
        onCloseFile={handleCloseFile}
      />

      <main className="max-w-7xl mx-auto">
        {transactions.length === 0 ? (
          <WelcomeScreen onDataLoaded={handleDataLoaded} />
        ) : (
          <DashboardContent
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            sortedTransactions={sortedTransactions}
            filters={filters}
            sort={sort}
            categories={categories}
            availableMonths={availableMonths}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            netBalance={netBalance}
            topIncomes={topIncomes}
            topExpenses={topExpenses}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onCloseFile={handleCloseFile}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
