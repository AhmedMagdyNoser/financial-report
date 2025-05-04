import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Category,
  TransactionFilters,
  TransactionType,
} from "@/types/transaction";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  categories: Category[];
  availableMonths: { value: string; label: string }[];
  className?: string;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  availableMonths,
  className,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const toggleCategory = (category: Category) => {
    let newCategories: Category[] | null;

    if (!filters.categories) {
      newCategories = [category];
    } else if (filters.categories.includes(category)) {
      newCategories = filters.categories.filter((c) => c !== category);
      if (newCategories.length === 0) newCategories = null;
    } else {
      newCategories = [...filters.categories, category];
    }

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const toggleStartingPointFilter = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      excludeStartingPoint: checked,
    });
  };

  const handleMonthChange = (month: string | null) => {
    onFiltersChange({
      ...filters,
      month: month === "all" ? null : month,
    });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        from: date,
      },
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        to: date,
      },
    });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === "" ? undefined : parseFloat(e.target.value);
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        min: value,
      },
    });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === "" ? undefined : parseFloat(e.target.value);
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        max: value,
      },
    });
  };

  const setTransactionType = (type: TransactionType) => {
    onFiltersChange({
      ...filters,
      transactionType: type,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: null,
      excludeStartingPoint: false,
      dateRange: { from: undefined, to: undefined },
      priceRange: { min: undefined, max: undefined },
      searchTerm: "",
      transactionType: "all",
      month: null,
    });
  };

  return (
    <div
      className={`space-y-4 bg-white p-5 border rounded-xl border-gray-100 shadow ${className}`}
    >
      <div className="flex flex-row gap-4 items-center flex-wrap justify-between">
        <h2 className="text-xl font-bold text-gray-800">Filter Transactions</h2>
        <Button size="sm" variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Search */}
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9"
          />
        </div>

        {/* Month Selector */}
        <div className="w-full md:w-1/4">
          <Select
            value={filters.month || ""}
            onValueChange={(value) => handleMonthChange(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Type selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="bg-gray-100 p-1 rounded-md flex w-full md:w-auto">
            <Button
              type="button"
              variant={filters.transactionType === "all" ? "default" : "ghost"}
              className={cn(
                "flex-1 text-xs md:text-sm hover:bg-transparent",
                filters.transactionType === "all"
                  ? "bg-white shadow-sm text-gray-900"
                  : "hover:text-primary"
              )}
              onClick={() => setTransactionType("all")}
            >
              All
            </Button>
            <Button
              type="button"
              variant={
                filters.transactionType === "income" ? "default" : "ghost"
              }
              className={cn(
                "flex-1 text-xs md:text-sm hover:bg-transparent",
                filters.transactionType === "income"
                  ? "bg-white text-green-600 shadow-sm"
                  : "hover:text-green-600"
              )}
              onClick={() => setTransactionType("income")}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={
                filters.transactionType === "expense" ? "default" : "ghost"
              }
              className={cn(
                "flex-1 text-xs md:text-sm hover:bg-transparent",
                filters.transactionType === "expense"
                  ? "bg-white text-red-600 shadow-sm"
                  : "hover:text-red-600"
              )}
              onClick={() => setTransactionType("expense")}
            >
              Expense
            </Button>
          </div>
        </div>

        {/* Reset Filters */}
      </div>

      {/* Exclude Starting Point Option */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="excludeStartingPoint"
          checked={filters.excludeStartingPoint}
          onCheckedChange={(checked) => toggleStartingPointFilter(!!checked)}
        />
        <Label
          htmlFor="excludeStartingPoint"
          className="text-sm cursor-pointer text-gray-600"
        >
          Exclude "Starting Point" category
        </Label>
      </div>

      {/* Categories */}
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <Label className="text-sm text-gray-600">Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                filters.categories?.includes(category) ? "default" : "outline"
              }
              className={cn(
                "cursor-pointer transition-all bg-white",
                filters.categories?.includes(category)
                  ? "bg-primary"
                  : "hover:bg-primary/10"
              )}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Min Amount</Label>
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min ?? ""}
            onChange={handleMinPriceChange}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-gray-500">Max Amount</Label>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max ?? ""}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>

      {/* Active Filters */}
      {(filters.categories ||
        filters.dateRange.from ||
        filters.dateRange.to ||
        filters.priceRange.min !== undefined ||
        filters.priceRange.max !== undefined ||
        filters.transactionType !== "all" ||
        filters.excludeStartingPoint ||
        filters.month) && (
        <div className="pt-2 border-t border-gray-100">
          <Label className="text-xs text-gray-500">Active Filters:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.transactionType !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Type: {filters.transactionType}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setTransactionType("all")}
                />
              </Badge>
            )}

            {filters.month && (
              <Badge variant="secondary" className="text-xs">
                Month:{" "}
                {availableMonths.find((m) => m.value === filters.month)
                  ?.label || filters.month}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleMonthChange(null)}
                />
              </Badge>
            )}

            {filters.excludeStartingPoint && (
              <Badge variant="secondary" className="text-xs">
                Exclude Starting Point
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => toggleStartingPointFilter(false)}
                />
              </Badge>
            )}

            {filters.categories &&
              filters.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => toggleCategory(cat)}
                  />
                </Badge>
              ))}

            {filters.dateRange.from && (
              <Badge variant="secondary" className="text-xs">
                From: {format(filters.dateRange.from, "MMM d, yyyy")}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleDateFromChange(undefined)}
                />
              </Badge>
            )}

            {filters.dateRange.to && (
              <Badge variant="secondary" className="text-xs">
                To: {format(filters.dateRange.to, "MMM d, yyyy")}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleDateToChange(undefined)}
                />
              </Badge>
            )}

            {filters.priceRange.min !== undefined && (
              <Badge variant="secondary" className="text-xs">
                Min: {formatCurrency(filters.priceRange.min)}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      priceRange: { ...filters.priceRange, min: undefined },
                    })
                  }
                />
              </Badge>
            )}

            {filters.priceRange.max !== undefined && (
              <Badge variant="secondary" className="text-xs">
                Max: {formatCurrency(filters.priceRange.max)}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      priceRange: { ...filters.priceRange, max: undefined },
                    })
                  }
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFiltersComponent;

import { formatCurrency } from "@/utils/transaction-utils";
