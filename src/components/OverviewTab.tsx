import { Transaction } from "@/types/transaction";
import { TabsContent } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, SearchX } from "lucide-react";
import ChartSection from "@/components/ChartSection";
import TransactionTable from "@/components/TransactionTable";

interface TransactionOverviewTabProps {
  filteredTransactions: Transaction[];
  topIncomes: Transaction[];
  topExpenses: Transaction[];
}

const OverviewTab: React.FC<TransactionOverviewTabProps> = ({ filteredTransactions, topIncomes, topExpenses }) => {
  const noData = (msg: string) => (
    <div className="flex flex-col items-center flex-1 justify-center text-gray-600 py-10 gap-3 bg-gray-100 rounded-lg">
      <SearchX className="h-8 w-8" />
      <p className="text-center">{msg}</p>
    </div>
  );

  return (
    <TabsContent value="combined" className="space-y-6">
      {/* Enhanced Charts Section */}
      <ChartSection transactions={filteredTransactions} />

      {/* Top Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col bg-white rounded-lg shadow">
          <header className="flex items-center gap-2 p-5 text-2xl text-green-600 font-semibold">
            <ArrowUp className="h-5 w-5 mr-2" />
            Top Income Sources
          </header>
          <div className="pt-0 p-5 flex flex-col flex-1">
            {topIncomes.length > 0 ? <TransactionTable transactions={topIncomes} /> : noData("No income transactions found")}
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-lg shadow">
          <header className="flex items-center gap-2 p-5 text-2xl text-red-600 font-semibold">
            <ArrowDown className="h-5 w-5 mr-2" />
            Top Expenses
          </header>
          <div className="pt-0 p-5 flex flex-col flex-1">
            {topExpenses.length > 0 ? (
              <TransactionTable transactions={topExpenses} />
            ) : (
              noData("No expense transactions found")
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
