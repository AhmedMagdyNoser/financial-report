import React from "react";
import { ArrowUp, ArrowDown, BarChart } from "lucide-react";
import { formatCurrency } from "@/utils/transaction-utils";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface StatisticsSectionProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ totalIncome, totalExpense, netBalance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatisticsCard title="Total Income" value={formatCurrency(totalIncome)} icon={<ArrowUp />} variant="income" />

      <StatisticsCard title="Total Expenses" value={formatCurrency(totalExpense)} icon={<ArrowDown />} variant="expense" />

      <StatisticsCard
        title="Net Balance"
        value={formatCurrency(netBalance)}
        icon={<BarChart />}
        variant={netBalance >= 0 ? "income" : "expense"}
      />
    </div>
  );
};

export default StatisticsSection;

// =============================================================

interface StatisticsProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "income" | "expense";
  className?: string;
}

const StatisticsCard: React.FC<StatisticsProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  variant = "default",
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "income":
        return {
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          valueColor: "text-green-600",
        };
      case "expense":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          valueColor: "text-red-600",
        };
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          valueColor: "text-gray-900",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={cn("p-5 border border-gray-100 shadow", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className={cn("text-2xl font-bold", styles.valueColor)}>{value}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}

          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : trend < 0 ? (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              ) : null}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500"
                )}
              >
                {Math.abs(trend)}% {trendLabel || (trend > 0 ? "increase" : "decrease")}
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className={cn("p-2 rounded-full", styles.iconBg)}>
            {React.cloneElement(icon as React.ReactElement, {
              className: cn("h-5 w-5", styles.iconColor),
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
