import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterButton = ({ 
  active = false,
  onClick,
  children,
  icon,
  className,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
        active 
          ? "bg-primary text-white shadow-lg" 
          : "bg-surface text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

export default FilterButton;