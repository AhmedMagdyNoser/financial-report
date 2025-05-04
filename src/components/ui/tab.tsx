import * as React from "react";
import { cn } from "@/lib/utils";

interface TabProps {
  value: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ children, className, active, onClick, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
          active ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900",
          className
        )}
        onClick={onClick}
        {...props}
      >
        {icon && <span className="text-current">{icon}</span>}
        {children}
      </button>
    );
  }
);
Tab.displayName = "Tab";

export { Tab };
