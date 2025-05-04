import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/types/transaction";
import {
  formatCurrency,
  getCategoryBreakdown,
  getDailyTotals,
  getMonthlySummary,
  formatPercentage,
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
} from "recharts";
import { Tab } from "@/components/ui/tab";

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

interface FinancialChartsProps {
  transactions: Transaction[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ transactions }) => {
  const [chartType, setChartType] = React.useState<TransactionType>("all");

  const categoryData = getCategoryBreakdown(transactions, chartType).slice(
    0,
    10
  ); // Top 10 categories

  const dailyData = Object.entries(getDailyTotals(transactions))
    .map(([date, value]) => ({
      date: date.slice(5), // Remove year for cleaner display
      value,
    }))
    .slice(-14) // Last 14 days
    .sort((a, b) => a.date.localeCompare(b.date));

  const monthlyData = Object.entries(getMonthlySummary(transactions))
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Category Breakdown</CardTitle>
            <div className="bg-gray-100 p-1 rounded-md flex">
              <Tab
                value="all"
                active={chartType === "all"}
                onClick={() => setChartType("all")}
              >
                All
              </Tab>
              <Tab
                value="income"
                active={chartType === "income"}
                onClick={() => setChartType("income")}
                className="text-green-600"
              >
                Income
              </Tab>
              <Tab
                value="expense"
                active={chartType === "expense"}
                onClick={() => setChartType("expense")}
                className="text-red-600"
              >
                Expense
              </Tab>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${formatCurrency(value)} (${formatPercentage(
                      props.payload.percentage
                    )})`,
                    name,
                  ]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Income vs. Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis type="category" dataKey="name" />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Amount",
                  ]}
                />
                <Bar dataKey="value" barSize={40}>
                  {incomeVsExpenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Daily Balance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Amount",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Amount",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
