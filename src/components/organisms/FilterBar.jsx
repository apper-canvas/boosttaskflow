import React from "react";
import FilterButton from "@/components/molecules/FilterButton";
import Select from "@/components/atoms/Select";

const FilterBar = ({ 
  filters,
  onFilterChange,
  className = ""
}) => {
  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Due Today" },
    { value: "week", label: "Due This Week" },
    { value: "overdue", label: "Overdue" }
  ];

  return (
    <div className={`bg-white border-b border-gray-100 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          
          <div className="flex items-center space-x-3">
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              options={statusOptions}
              className="w-32"
            />
            
            <Select
              value={filters.priority}
              onChange={(e) => onFilterChange("priority", e.target.value)}
              options={priorityOptions}
              className="w-40"
            />
            
            <Select
              value={filters.dateRange}
              onChange={(e) => onFilterChange("dateRange", e.target.value)}
              options={dateRangeOptions}
              className="w-36"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <FilterButton
            active={filters.status === "active"}
            onClick={() => onFilterChange("status", filters.status === "active" ? "all" : "active")}
            icon="Circle"
          >
            Active
          </FilterButton>
          
          <FilterButton
            active={filters.priority === "high"}
            onClick={() => onFilterChange("priority", filters.priority === "high" ? "all" : "high")}
            icon="AlertTriangle"
          >
            High Priority
          </FilterButton>
          
          <FilterButton
            active={filters.dateRange === "today"}
            onClick={() => onFilterChange("dateRange", filters.dateRange === "today" ? "all" : "today")}
            icon="Calendar"
          >
            Due Today
          </FilterButton>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;