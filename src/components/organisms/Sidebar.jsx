import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import TaskListItem from "@/components/molecules/TaskListItem";
import Loading from "@/components/ui/Loading";
import listService from "@/services/api/listService";

const Sidebar = ({ 
  activeListId,
  onListSelect,
  className = ""
}) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const allLists = await listService.getAll();
      setLists(allLists);
    } catch (err) {
      console.error("Failed to load lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const allTasksList = {
    Id: "all",
    name: "All Tasks",
    icon: "List",
    taskCount: lists.reduce((sum, list) => sum + list.taskCount, 0)
  };

  return (
    <div className={`bg-surface border-r border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
        </div>

        <nav className="space-y-2">
          <TaskListItem
            list={allTasksList}
            active={activeListId === "all"}
            onClick={() => onListSelect("all")}
          />
          
          {loading ? (
            <Loading type="lists" />
          ) : (
            <AnimatePresence>
              {lists.map((list) => (
                <motion.div
                  key={list.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <TaskListItem
                    list={list}
                    active={activeListId === list.Id}
                    onClick={() => onListSelect(list.Id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;