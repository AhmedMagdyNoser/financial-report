import React from "react";
import { Card } from "@/components/ui/card";
import { Upload, FileText, BarChart2 } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { Transaction } from "@/types/transaction";

interface WelcomeScreenProps {
  onDataLoaded: (data: Transaction[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDataLoaded }) => {
  return (
    <Card className="px-8 py-16 shadow-lg bg-white animate-fade-in border-none rounded-xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <BarChart2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Financial Dashboard
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Upload your financial data to generate comprehensive insights and
          visualizations
        </p>
        <FileUploader
          onDataLoaded={onDataLoaded}
          className="max-w-sm mx-auto mb-8"
        />
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">CSV Format</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Easy Upload</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Required columns: Category, Name, Price, Date, and Notes
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeScreen;
