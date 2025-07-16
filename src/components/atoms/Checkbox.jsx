import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = React.forwardRef(({ 
  checked = false,
  onChange,
  className,
  ...props 
}, ref) => {
  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
        checked 
          ? "bg-primary border-primary" 
          : "border-gray-300 hover:border-primary/50"
      )}>
        {checked && (
          <ApperIcon 
            name="Check" 
            className="w-3 h-3 text-white" 
          />
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;