import { Transaction, TransactionSort } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import TransactionTable from "@/components/TransactionTable";
import TransactionSortComponent from "@/components/TransactionSort";

interface AllTransactionsTabProps {
  sortedTransactions: Transaction[];
  sort: TransactionSort;
  onSortChange: (sort: TransactionSort) => void;
}

const TransactionsTab: React.FC<AllTransactionsTabProps> = ({ sortedTransactions, sort, onSortChange }) => {
  return (
    <TabsContent value="transactions" className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          <TransactionSortComponent sort={sort} onSortChange={onSortChange} />
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={sortedTransactions} sort={sort} onSortChange={onSortChange} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TransactionsTab;
