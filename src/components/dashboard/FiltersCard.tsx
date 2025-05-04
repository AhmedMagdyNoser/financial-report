import React from "react";
import TransactionFilters from "@/components/TransactionFilters";
import { Category, TransactionFilters as Filters } from "@/types/transaction";

interface FiltersCardProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  categories: Category[];
  availableMonths: { value: string; label: string }[];
  onCloseFile: () => void;
}

const FiltersCard: React.FC<FiltersCardProps> = ({
  filters,
  onFiltersChange,
  categories,
  availableMonths,
}) => {
  return (
    <div>
      <TransactionFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        categories={categories}
        availableMonths={availableMonths}
      />
    </div>
  );
};

export default FiltersCard;
