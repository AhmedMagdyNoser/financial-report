import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/types/transaction";
import {
  formatCurrency,
  getCategoryBreakdown,
  getDailyTotals,
  getMonthlySummary,
  formatPercentage,
  getWeeklyTotals,
  getTopCategories,
} from "@/utils/transaction-utils";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { Tab } from "@/components/ui/tab";
import { Tabs } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6b7280",
  "#475569",
];

interface EnhancedChartSectionProps {
  transactions: Transaction[];
}

const EnhancedChartSection: React.FC<EnhancedChartSectionProps> = ({
  transactions,
}) => {
  const [chartType, setChartType] = useState<TransactionType>("all");
  const [timeframeType, setTimeframeType] = useState<"weekly" | "monthly">(
    "monthly"
  );

  // Get category data for bar chart
  const categoryData = getTopCategories(transactions, chartType, 8);

  // Time-based data
  const weeklyData = Object.entries(getWeeklyTotals(transactions))
    .map(([week, data]) => ({
      week,
      income: data.income,
      expense: Math.abs(data.expense),
      balance: data.balance,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  const monthlyData = Object.entries(getMonthlySummary(transactions))
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: Math.abs(data.expense),
      balance: data.balance,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const incomeVsExpenseData = [
    {
      name: "Income",
      value: transactions
        .filter((tx) => tx.price >= 0)
        .reduce((sum, tx) => sum + tx.price, 0),
    },
    {
      name: "Expense",
      value: Math.abs(
        transactions
          .filter((tx) => tx.price < 0)
          .reduce((sum, tx) => sum + tx.price, 0)
      ),
    },
  ];

  let timeframeData;
  let timeframeKey;
  let timeframeLabel;

  switch (timeframeType) {
    case "weekly":
      timeframeData = weeklyData;
      timeframeKey = "week";
      timeframeLabel = "Weekly Summary";
      break;
    case "monthly":
      timeframeData = monthlyData;
      timeframeKey = "month";
      timeframeLabel = "Monthly Overview";
      break;
    default:
      timeframeData = monthlyData;
      timeframeKey = "month";
      timeframeLabel = "Monthly Overview";
  }

  // Custom tooltip formatter for currency values
  const currencyFormatter = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div className="space-y-6">
      {/* First row - Category Breakdown and Income vs Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center flex-wrap gap-4 mb-1 justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5" />
                Top Categories
              </CardTitle>
              <div className="bg-gray-100 p-1 rounded-md flex">
                <Tab
                  value="all"
                  active={chartType === "all"}
                  onClick={() => setChartType("all")}
                  icon={<PieChartIcon className="h-4 w-4" />}
                >
                  All
                </Tab>
                <Tab
                  value="income"
                  active={chartType === "income"}
                  onClick={() => setChartType("income")}
                  className="text-green-600"
                  icon={<ArrowUp className="h-4 w-4" />}
                >
                  Income
                </Tab>
                <Tab
                  value="expense"
                  active={chartType === "expense"}
                  onClick={() => setChartType("expense")}
                  className="text-red-600"
                  icon={<ArrowDown className="h-4 w-4" />}
                >
                  Expense
                </Tab>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Amount",
                    ]}
                    labelFormatter={(label) => {
                      const item = categoryData.find(
                        (item) => item.name === label
                      );
                      return `${label} (${
                        item?.transactionType === "income"
                          ? "Income"
                          : "Expense"
                      })`;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Amount"
                    fill="#8884d8"
                    barSize={20}
                    radius={[0, 4, 4, 0]}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.transactionType === "income"
                            ? "#10b981"
                            : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Income vs. Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeVsExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    <Cell key="cell-0" fill="#10b981" />
                    <Cell key="cell-1" fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Amount",
                    ]}
                  />
                  <Legend verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row - Time-based charts */}
      <Card className="shadow">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              {timeframeLabel}
            </CardTitle>
            <div className="bg-gray-100 p-1 rounded-md flex">
              <Tab
                value="weekly"
                active={timeframeType === "weekly"}
                onClick={() => setTimeframeType("weekly")}
              >
                Weekly
              </Tab>
              <Tab
                value="monthly"
                active={timeframeType === "monthly"}
                onClick={() => setTimeframeType("monthly")}
              >
                Monthly
              </Tab>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeframeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={timeframeKey}
                  tickFormatter={(value) => {
                    // Format the x-axis labels
                    if (timeframeType === "weekly") {
                      // Extract the week number from YYYY-WXX format
                      const weekNum = value.split("-W")[1];
                      return `Week ${weekNum}`;
                    } else {
                      // For monthly, convert YYYY-MM to MMM YYYY
                      try {
                        const year = value.split("-")[0];
                        const month = value.split("-")[1];
                        const monthNames = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
                      } catch (e) {
                        return value;
                      }
                    }
                  }}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "income")
                      return [formatCurrency(value), "Income"];
                    if (name === "expense")
                      return [formatCurrency(value), "Expense"];
                    return [formatCurrency(value), "Balance"];
                  }}
                  labelFormatter={(value) => {
                    if (timeframeType === "weekly") {
                      const weekNum = value.split("-W")[1];
                      return `Week ${weekNum}`;
                    } else {
                      try {
                        const year = value.split("-")[0];
                        const month = value.split("-")[1];
                        const monthNames = [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ];
                        return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
                      } catch (e) {
                        return value;
                      }
                    }
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  barSize={20}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChartSection;

import { ArrowDown, ArrowUp } from "lucide-react";
