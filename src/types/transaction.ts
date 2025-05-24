export type Category = string;

export interface Transaction {
  id: string;
  category: Category;
  name: string;
  price: number;
  date: Date;
  notes: string;
}

export type TransactionType = "income" | "expense" | "all";

export type SortField = "date" | "price";
export type SortDirection = "asc" | "desc";

export interface TransactionSort {
  field: SortField;
  direction: SortDirection;
}

export type TransactionFilters = {
  categories: Category[] | null;
  excludeStartingPoint: boolean;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  priceRange: {
    min: number | undefined;
    max: number | undefined;
  };
  searchTerm: string;
  transactionType: TransactionType;
};
