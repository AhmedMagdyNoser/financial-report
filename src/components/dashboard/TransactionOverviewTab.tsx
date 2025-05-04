import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
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
        <Card className="shadow-md">
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
              <p className="text-center py-8 text-muted-foreground">
                No income transactions found
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
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
              <p className="text-center py-8 text-muted-foreground">
                No expense transactions found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default TransactionOverviewTab;
