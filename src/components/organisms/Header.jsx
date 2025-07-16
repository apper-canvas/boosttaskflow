import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "@/App";

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchClear, 
  onAddTask,
  currentListName = "All Tasks"
}) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">
              {currentListName}
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onSearchClear}
              placeholder="Search tasks..."
            />
          </div>
          
          <Button
            onClick={onAddTask}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>

          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <div className="hidden md:block text-sm text-gray-600">
                Welcome, {user?.firstName || user?.name || 'User'}
              </div>
              <Button
                onClick={logout}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden mt-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search tasks..."
        />
      </div>
    </header>
  );
};

export default Header;