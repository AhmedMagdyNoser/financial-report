import { Category, Transaction, TransactionFilters as Filters, TransactionSort } from "@/types/transaction";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiltersSection from "@/components/FiltersSection";
import StatisticsSection from "@/components/StatisticsSection";
import OverviewTab from "@/components/OverviewTab";
import TransactionsTab from "@/components/TransactionsTab";

interface DashboardContentProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  sortedTransactions: Transaction[];
  filters: Filters;
  sort: TransactionSort;
  categories: Category[];
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topIncomes: Transaction[];
  topExpenses: Transaction[];
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: TransactionSort) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  filteredTransactions,
  sortedTransactions,
  filters,
  sort,
  categories,
  totalIncome,
  totalExpense,
  netBalance,
  topIncomes,
  topExpenses,
  onFiltersChange,
  onSortChange,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <FiltersSection filters={filters} onFiltersChange={onFiltersChange} categories={categories} />

      {/* Stats Cards */}
      <StatisticsSection totalIncome={totalIncome} totalExpense={totalExpense} netBalance={netBalance} />

      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-lg bg-white border mb-6">
          <TabsTrigger value="combined" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Transactions
          </TabsTrigger>
        </TabsList>

        <OverviewTab filteredTransactions={filteredTransactions} topIncomes={topIncomes} topExpenses={topExpenses} />
        <TransactionsTab sortedTransactions={sortedTransactions} sort={sort} onSortChange={onSortChange} />
      </Tabs>
    </div>
  );
};

export default DashboardContent;
