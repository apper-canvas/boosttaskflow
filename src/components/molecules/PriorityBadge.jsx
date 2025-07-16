import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const PriorityBadge = ({ priority, className, ...props }) => {
  const priorityConfig = {
    high: { variant: "high", label: "High" },
    medium: { variant: "medium", label: "Medium" },
    low: { variant: "low", label: "Low" }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge
      variant={config.variant}
      size="sm"
      className={cn(className)}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;