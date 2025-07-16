import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  searchQuery,
  onSearchChange,
  onSearchClear,
  onAddTask,
  currentListName = "All Tasks"
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentListName}
          </h1>
          <p className="text-gray-600 mt-1">
            Organize your tasks and stay productive
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
            placeholder="Search tasks..."
            className="w-80"
          />
          
          <Button
            onClick={onAddTask}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;