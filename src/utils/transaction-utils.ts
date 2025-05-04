import {
  Category,
  Transaction,
  TransactionFilters,
  TransactionType,
  TransactionSort,
} from "@/types/transaction";
import { isWithinInterval, format, parse } from "date-fns";

export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Exclude Starting Point category if filter is active
    if (
      filters.excludeStartingPoint &&
      transaction.category === "Starting Point"
    ) {
      return false;
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(transaction.category)) {
        return false;
      }
    }

    // Transaction type filter
    if (filters.transactionType !== "all") {
      if (filters.transactionType === "income" && transaction.price < 0) {
        return false;
      }
      if (filters.transactionType === "expense" && transaction.price >= 0) {
        return false;
      }
    }

    // Month filter
    if (filters.month) {
      try {
        const txMonth = format(transaction.date, "yyyy-MM");
        if (txMonth !== filters.month) {
          return false;
        }
      } catch (error) {
        console.error(
          "Error formatting date for month filter:",
          transaction.date
        );
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      try {
        const transactionDate = new Date(transaction.date);
        if (
          !isWithinInterval(transactionDate, {
            start: filters.dateRange.from,
            end: filters.dateRange.to,
          })
        ) {
          return false;
        }
      } catch (error) {
        console.error("Error processing date range filter:", transaction.date);
        return false;
      }
    } else if (filters.dateRange.from) {
      try {
        const transactionDate = new Date(transaction.date);
        if (transactionDate < filters.dateRange.from) {
          return false;
        }
      } catch (error) {
        console.error("Error processing 'from' date filter:", transaction.date);
        return false;
      }
    } else if (filters.dateRange.to) {
      try {
        const transactionDate = new Date(transaction.date);
        if (transactionDate > filters.dateRange.to) {
          return false;
        }
      } catch (error) {
        console.error("Error processing 'to' date filter:", transaction.date);
        return false;
      }
    }

    // Price range filter
    if (
      filters.priceRange.min !== undefined &&
      transaction.price < filters.priceRange.min
    ) {
      return false;
    }
    if (
      filters.priceRange.max !== undefined &&
      transaction.price > filters.priceRange.max
    ) {
      return false;
    }

    // Search term filter (case-insensitive)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        transaction.name.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower) ||
        transaction.notes.toLowerCase().includes(searchLower) ||
        transaction.price.toString().includes(searchLower)
      );
    }

    return true;
  });
};

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((tx) => tx.price < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.price), 0);
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((tx) => tx.price >= 0)
    .reduce((sum, transaction) => sum + transaction.price, 0);
};

export const calculateNetBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.price, 0);
};

export const getCategoryTotals = (
  transactions: Transaction[],
  type: TransactionType = "all"
): Record<string, number> => {
  const filteredTransactions =
    type === "all"
      ? transactions
      : type === "income"
      ? transactions.filter((tx) => tx.price >= 0)
      : transactions.filter((tx) => tx.price < 0);

  const categoryTotals: Record<string, number> = {};

  filteredTransactions.forEach((transaction) => {
    const category = transaction.category || "Unknown";
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += Math.abs(transaction.price);
  });

  return categoryTotals;
};

export const getDailyTotals = (
  transactions: Transaction[],
  type: TransactionType = "all"
): Record<string, number> => {
  const filteredTransactions =
    type === "all"
      ? transactions
      : type === "income"
      ? transactions.filter((tx) => tx.price >= 0)
      : transactions.filter((tx) => tx.price < 0);

  const dailyTotals: Record<string, number> = {};

  filteredTransactions.forEach((transaction) => {
    // Format the date to avoid issues with invalid date objects
    try {
      // Use format from date-fns instead of toISOString to avoid errors with invalid dates
      const dateStr = format(transaction.date, "yyyy-MM-dd");
      if (!dailyTotals[dateStr]) {
        dailyTotals[dateStr] = 0;
      }
      dailyTotals[dateStr] +=
        type === "expense" ? Math.abs(transaction.price) : transaction.price;
    } catch (error) {
      console.error("Error processing date for transaction:", transaction);
      // Skip this transaction if date is invalid
    }
  });

  return dailyTotals;
};

export const getUniqueCategories = (
  transactions: Transaction[]
): Category[] => {
  const categories = new Set<Category>();
  transactions.forEach((tx) => {
    if (tx.category) categories.add(tx.category);
  });
  return Array.from(categories).sort();
};

export const getMonthlySummary = (
  transactions: Transaction[]
): Record<string, { income: number; expense: number; balance: number }> => {
  const monthlySummary: Record<
    string,
    { income: number; expense: number; balance: number }
  > = {};

  // Sort transactions by date first to ensure chronological order
  const sortedTransactions = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  sortedTransactions.forEach((transaction) => {
    try {
      const monthYear = format(transaction.date, "yyyy-MM");

      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { income: 0, expense: 0, balance: 0 };
      }

      if (transaction.price >= 0) {
        monthlySummary[monthYear].income += transaction.price;
      } else {
        monthlySummary[monthYear].expense += Math.abs(transaction.price);
      }

      monthlySummary[monthYear].balance += transaction.price;
    } catch (error) {
      console.error("Error processing date for monthly summary:", transaction);
    }
  });

  // Convert to array, sort chronologically, then convert back to object
  return monthlySummary;
};

export const getCategoryBreakdown = (
  transactions: Transaction[],
  type: TransactionType = "all"
): { name: string; value: number; percentage: number }[] => {
  const categoryTotals = getCategoryTotals(transactions, type);
  const total = Object.values(categoryTotals).reduce(
    (sum, value) => sum + value,
    0
  );

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getTopTransactions = (
  transactions: Transaction[],
  type: TransactionType,
  limit: number
): Transaction[] => {
  const filtered =
    type === "income"
      ? transactions.filter((tx) => tx.price >= 0)
      : transactions.filter((tx) => tx.price < 0);

  return [...filtered]
    .sort((a, b) =>
      type === "income"
        ? b.price - a.price
        : Math.abs(b.price) - Math.abs(a.price)
    )
    .slice(0, limit);
};

// Sort transactions based on the provided sort options
export const sortTransactions = (
  transactions: Transaction[],
  sort: TransactionSort
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    switch (sort.field) {
      case "date":
        return sort.direction === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      case "price":
        return sort.direction === "asc" ? a.price - b.price : b.price - a.price;
      case "category":
        return sort.direction === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      case "name":
        const aName = a.name || "";
        const bName = b.name || "";
        return sort.direction === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      default:
        return 0;
    }
  });
};

// Get top categories by transaction amount
export const getTopCategories = (
  transactions: Transaction[],
  type: TransactionType,
  limit: number = 10
): { name: string; value: number; transactionType: TransactionType }[] => {
  const filteredTx =
    type === "all"
      ? transactions
      : transactions.filter((tx) => {
          return type === "income" ? tx.price >= 0 : tx.price < 0;
        });

  const categoryMap = filteredTx.reduce((acc, tx) => {
    const category = tx.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(tx.price);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryMap)
    .map(([name, value]) => {
      // Determine if this category is generally income or expense
      const txType: TransactionType =
        name === "Starting Point"
          ? "income"
          : filteredTx.find((tx) => tx.category === name)?.price >= 0
          ? "income"
          : "expense";

      return {
        name,
        value,
        transactionType: txType,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

// Get weekly totals in chronological order
export const getWeeklyTotals = (transactions: Transaction[]) => {
  const weeklyTotals: Record<
    string,
    { income: number; expense: number; balance: number }
  > = {};

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  sortedTransactions.forEach((tx) => {
    // Get ISO week number (YYYY-WW)
    const date = new Date(tx.date);
    const year = date.getFullYear();

    // Get the week number (1-52)
    // First day of the year
    const firstDay = new Date(year, 0, 1);
    // Calculate days passed
    const daysPassed = Math.floor(
      (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
    );
    // Calculate week number
    const weekNumber = Math.ceil((daysPassed + firstDay.getDay() + 1) / 7);

    // Format as YYYY-WW
    const weekKey = `${year}-W${weekNumber.toString().padStart(2, "0")}`;

    if (!weeklyTotals[weekKey]) {
      weeklyTotals[weekKey] = { income: 0, expense: 0, balance: 0 };
    }

    if (tx.price >= 0) {
      weeklyTotals[weekKey].income += tx.price;
    } else {
      weeklyTotals[weekKey].expense += Math.abs(tx.price);
    }

    weeklyTotals[weekKey].balance += tx.price;
  });

  return weeklyTotals;
};

// Get months for filtering
export const getAvailableMonths = (
  transactions: Transaction[]
): { value: string; label: string }[] => {
  const months = new Set<string>();

  transactions.forEach((tx) => {
    try {
      const monthYear = format(tx.date, "yyyy-MM");
      months.add(monthYear);
    } catch (error) {
      console.error("Error processing date for month filter:", tx.date);
    }
  });

  return Array.from(months)
    .sort() // Sort chronologically
    .map((month) => {
      // Convert YYYY-MM to Month YYYY format for display
      try {
        const date = parse(month, "yyyy-MM", new Date());
        return {
          value: month,
          label: format(date, "MMMM yyyy"),
        };
      } catch (error) {
        console.error("Error formatting month label:", month);
        return {
          value: month,
          label: month, // Fallback
        };
      }
    });
};
