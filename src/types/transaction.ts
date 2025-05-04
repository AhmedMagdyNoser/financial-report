export type Category =
  | "Unknown"
  | "Orange Fees"
  | "Etisalat Fees"
  | "Others"
  | "Drink"
  | "Transportation"
  | "Snacks"
  | "Food"
  | "Support"
  | "Salary"
  | "Clothes"
  | "Starting Point"
  | "Hair Cut"
  | "Football"
  | "Donation"
  | "Document";

export interface Transaction {
  id: string;
  category: Category;
  name: string;
  price: number;
  date: Date;
  notes: string;
}

export type TransactionType = "income" | "expense" | "all";

export type SortField = "date" | "price" | "category" | "name";
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
  month: string | null; // Format: "YYYY-MM"
};
