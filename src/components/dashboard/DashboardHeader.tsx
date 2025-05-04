import React from "react";
import { BarChart, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";

interface DashboardHeaderProps {
  transactions: Transaction[];
  onDataLoaded: (data: Transaction[]) => void;
  onCloseFile: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  transactions,
  onCloseFile,
}) => {
  return (
    <header className="max-w-7xl mx-auto mb-4 md:mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-1 md:text-4xl font-bold text-gray-900 flex items-center">
            <BarChart className="h-8 w-8 mr-3 text-blue-500" />
            Financial Report
          </h1>
          <p className="text-gray-600">
            Track, analyze, and optimize your financial activity
          </p>
        </div>

        {transactions.length > 0 ? (
          <Button
            variant="default"
            onClick={onCloseFile}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600"
          >
            <FileX className="h-4 w-4" />
            Close File
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default DashboardHeader;
