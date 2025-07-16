import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import TaskListItem from "@/components/molecules/TaskListItem";
import Loading from "@/components/ui/Loading";

const MobileSidebar = ({ 
  isOpen,
  onClose,
  lists,
  loading,
  activeListId,
  onListSelect
}) => {
  const allTasksList = {
    Id: "all",
    name: "All Tasks",
    icon: "List",
    taskCount: lists.reduce((sum, list) => sum + list.taskCount, 0)
  };

  const handleListSelect = (listId) => {
    onListSelect(listId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-surface border-r border-gray-200 z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <TaskListItem
                  list={allTasksList}
                  active={activeListId === "all"}
                  onClick={() => handleListSelect("all")}
                />
                
                {loading ? (
                  <Loading type="lists" />
                ) : (
                  lists.map((list) => (
                    <TaskListItem
                      key={list.Id}
                      list={list}
                      active={activeListId === list.Id}
                      onClick={() => handleListSelect(list.Id)}
                    />
                  ))
                )}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;