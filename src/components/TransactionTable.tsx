import { Transaction, TransactionSort } from "@/types/transaction";
import { formatCurrency } from "@/utils/transaction-utils";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowDown, ArrowUp } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  className?: string;
  sort?: TransactionSort;
  onSortChange?: (sort: TransactionSort) => void;
  showSortIndicators?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  className,
  sort,
  onSortChange,
  showSortIndicators = true,
}) => {
  const handleSortClick = (field: TransactionSort["field"]) => {
    if (!onSortChange || !sort) return;

    if (sort.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to descending for new field
      onSortChange({
        field,
        direction: "desc",
      });
    }
  };

  const SortIndicator = ({ field }: { field: TransactionSort["field"] }) => {
    if (!sort || !showSortIndicators) return null;

    if (sort.field !== field) return null;

    return sort.direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className={`overflow-auto rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSortClick("date")}>
              Date <SortIndicator field="date" />
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="text-right whitespace-nowrap cursor-pointer" onClick={() => handleSortClick("price")}>
              Amount <SortIndicator field="price" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="whitespace-nowrap">{format(transaction.date, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal bg-gray-50 text-nowrap">
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap max-w-[200px] truncate">
                  <div className="flex items-center gap-1.5">
                    {transaction.name || "-"}
                    {transaction.notes !== "\r" && (
                      <span className="inline-flex" title={transaction.notes}>
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium whitespace-nowrap",
                    transaction.price < 0 ? "text-red-600" : "text-green-600"
                  )}
                >
                  {formatCurrency(transaction.price)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
