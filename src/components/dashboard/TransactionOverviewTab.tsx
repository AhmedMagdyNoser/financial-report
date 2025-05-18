import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, SearchX } from "lucide-react";
import EnhancedChartSection from "@/components/EnhancedChartSection";
import TransactionTable from "@/components/TransactionTable";
import { Transaction } from "@/types/transaction";

interface TransactionOverviewTabProps {
  filteredTransactions: Transaction[];
  topIncomes: Transaction[];
  topExpenses: Transaction[];
}

const TransactionOverviewTab: React.FC<TransactionOverviewTabProps> = ({
  filteredTransactions,
  topIncomes,
  topExpenses,
}) => {
  return (
    <TabsContent value="combined" className="space-y-6">
      {/* Enhanced Charts Section */}
      <EnhancedChartSection transactions={filteredTransactions} />

      {/* Top Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <ArrowUp className="h-5 w-5 mr-2" />
              Top Income Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topIncomes.length > 0 ? (
              <TransactionTable transactions={topIncomes} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600 py-10 gap-3 bg-gray-100 rounded-lg">
                <SearchX className="h-8 w-8" />
                <p className="text-center">No income transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <ArrowDown className="h-5 w-5 mr-2" />
              Top Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topExpenses.length > 0 ? (
              <TransactionTable transactions={topExpenses} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600 py-10 gap-3 bg-gray-100 rounded-lg">
                <SearchX className="h-8 w-8" />
                <p className="text-center">No expense transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default TransactionOverviewTab;
