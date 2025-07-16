import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TaskListItem = ({ 
  list,
  active = false,
  onClick,
  className,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      {...props}
    >
      <ApperIcon 
        name={list.icon} 
        className={cn(
          "w-5 h-5 transition-colors",
          active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
        )}
      />
      <span className="flex-1 font-medium">{list.name}</span>
      {list.taskCount > 0 && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          active 
            ? "bg-primary/20 text-primary" 
            : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
        )}>
          {list.taskCount}
        </span>
      )}
    </button>
  );
};

export default TaskListItem;