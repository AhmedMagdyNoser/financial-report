import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseCSV } from "@/utils/csv-parser";
import { Transaction } from "@/types/transaction";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onDataLoaded: (data: Transaction[]) => void;
  className?: string;
  compact?: boolean;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onDataLoaded,
  className,
  compact = false,
  label = "Upload New File",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateCSVFormat = (headers: string[]): boolean => {
    const requiredHeaders = ["Category", "Name", "Price", "Date"];
    return requiredHeaders.every((h) =>
      headers.some(
        (header) => header.toLowerCase().trim() === h.toLowerCase().trim()
      )
    );
  };

  const handleFileRead = (file: File) => {
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // Validate CSV format first
        const firstLine = content.split("\n")[0];
        const headers = firstLine
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        if (!validateCSVFormat(headers)) {
          toast({
            title: "Invalid CSV format",
            description:
              "CSV must include: Category, Name, Price, Date columns",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Try to parse the CSV
        const transactions = parseCSV(content);

        if (!transactions || transactions.length === 0) {
          toast({
            title: "No valid transactions found",
            description: "Please check your CSV file format.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "CSV loaded successfully",
          description: `${transactions.length} transactions imported.`,
        });

        onDataLoaded(transactions);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error parsing CSV",
          description: "Please check your CSV file format.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "An error occurred while reading the file.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".csv")) {
        handleFileRead(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileRead(files[0]);
    }

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (compact) {
    return (
      <div className={`${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isLoading ? "Processing..." : label}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleFileDrop}
    >
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-medium">Upload CSV File</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop your CSV file here, or click to browse
            </p>
          </div>

          <input
            ref={fileInputRef}
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            variant="outline"
            disabled={isLoading}
            className="cursor-pointer"
            type="button"
            onClick={handleButtonClick}
          >
            {isLoading ? "Processing..." : "Browse Files"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
