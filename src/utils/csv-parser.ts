import { Category, Transaction } from "@/types/transaction";
import { parse } from "date-fns";

export const parseCSV = (content: string): Transaction[] => {
  const lines = content.trim().split("\n");

  // Skip header row
  if (lines.length <= 1) {
    return [];
  }

  const transactions: Transaction[] = [];

  // Define all valid categories
  const validCategories: Category[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quotes that might contain commas
    const row = parseCSVRow(lines[i]);

    if (row.length < 4) continue; // Skip invalid rows

    // Parse date in various formats
    let date: Date;
    try {
      // Try parsing with format "May 3, 2023"
      const dateString = row[3].replace(/"/g, "").trim();
      date = parse(dateString, "MMMM d, yyyy", new Date());

      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try alternate formats if the first one fails
        date = new Date(dateString);

        if (isNaN(date.getTime())) {
          console.error("Invalid date:", dateString);
          continue; // Skip this row if date is invalid
        }
      }
    } catch (error) {
      console.error("Failed to parse date:", row[3]);
      continue; // Skip this row if date parsing fails
    }

    // Get category value from CSV and validate it
    let categoryValue = row[0]?.trim() || "Unknown";

    // Make sure categoryValue is not empty
    if (!categoryValue) {
      categoryValue = "Unknown";
    }

    // Check if it's a valid category, otherwise add it to valid categories if it's new
    let category: Category;
    if (validCategories.includes(categoryValue as Category)) {
      category = categoryValue as Category;
    } else {
      // Add the new category to our list of valid categories
      // This is a runtime expansion of our type system
      validCategories.push(categoryValue as Category);
      category = categoryValue as Category;
    }

    const transaction: Transaction = {
      id: `${i}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      category: category,
      name: row[1]?.trim() || "",
      price: parseFloat(row[2]) || 0,
      date,
      notes: row[4] || "",
    };

    transactions.push(transaction);
  }

  // Sort by date, newest first
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Helper function to handle quoted fields in CSV
function parseCSVRow(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
