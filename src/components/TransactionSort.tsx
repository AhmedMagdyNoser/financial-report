import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortField, type TransactionSort } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TransactionSortProps {
  sort: TransactionSort;
  onSortChange: (sort: TransactionSort) => void;
}

const TransactionSortComponent: React.FC<TransactionSortProps> = ({ sort, onSortChange }) => {
  const toggleDirection = () => {
    onSortChange({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" });
  };

  const handleFieldChange = (field: SortField) => {
    onSortChange({ field, direction: sort.direction });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sort.field} onValueChange={(value) => handleFieldChange(value as SortField)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="price">Amount</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={toggleDirection} className="h-10 w-10">
        {sort.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default TransactionSortComponent;
