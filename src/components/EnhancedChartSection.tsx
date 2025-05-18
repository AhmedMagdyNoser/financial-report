import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/types/transaction";
import {
  formatCurrency,
  getMonthlySummary,
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
  Line,
  ComposedChart,
} from "recharts";
import { Tab } from "@/components/ui/tab";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  SearchX,
  ArrowDown,
  ArrowUp,
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

  // Get category data for bar chart
  const categoryData = getTopCategories(transactions, chartType, 8);

  // Monthly data
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

  const noDataAvailable = (
    <div className="flex h-full flex-col items-center justify-center text-gray-600 py-10 gap-3 bg-gray-100 rounded-lg">
      <SearchX className="h-8 w-8" />
      <p className="text-center">No data available</p>
    </div>
  );

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
              {categoryData.length === 0 ? (
                noDataAvailable
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10 }}
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
              )}
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
              {incomeVsExpenseData.every((item) => item.value === 0) ? (
                noDataAvailable
              ) : (
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row - Monthly Overview Chart */}
      <Card className="shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 mb-4">
            <LineChartIcon className="h-5 w-5" />
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            {monthlyData.length === 0 ? (
              noDataAvailable
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
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
                    }}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the data point that corresponds to this label
                        const dataPoint = monthlyData.find(
                          (item) => item.month === label
                        );

                        if (!dataPoint) return null;

                        // Format the date label
                        const year = label.split("-")[0];
                        const month = parseInt(label.split("-")[1], 10);
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
                        const dateLabel = `${monthNames[month - 1]} ${year}`;

                        return (
                          <div className="bg-white p-3 border rounded shadow-md">
                            <p className="text-sm font-medium mb-2">
                              {dateLabel}
                            </p>
                            <p className="mb-1 text-green-600">
                              Income: {formatCurrency(dataPoint.income)}
                            </p>
                            <p className="mb-1 text-red-600">
                              Expense: {formatCurrency(dataPoint.expense)}
                            </p>
                            <p className="mb-1 text-indigo-600">
                              Balance: {formatCurrency(dataPoint.balance)}
                            </p>
                          </div>
                        );
                      }
                      return null;
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChartSection;
