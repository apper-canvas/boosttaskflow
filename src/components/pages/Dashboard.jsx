import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Header from "@/components/organisms/Header";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import listService from "@/services/api/listService";

const Dashboard = () => {
  const [activeListId, setActiveListId] = useState("all");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentListName, setCurrentListName] = useState("All Tasks");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: "all"
  });

  useEffect(() => {
    updateCurrentListName();
  }, [activeListId]);

  const updateCurrentListName = async () => {
    if (activeListId === "all") {
      setCurrentListName("All Tasks");
      return;
    }

    try {
      const lists = await listService.getAll();
      const currentList = lists.find(list => list.Id === activeListId);
      setCurrentListName(currentList ? currentList.name : "All Tasks");
    } catch (err) {
      console.error("Failed to get list name:", err);
    }
  };

  const handleListSelect = (listId) => {
    setActiveListId(listId);
    setShowMobileMenu(false);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    // Trigger refresh by updating a state that TaskList depends on
    setActiveListId(prev => prev); // Force re-render
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const handleToggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <Layout
      activeListId={activeListId}
      onListSelect={handleListSelect}
      showMobileMenu={showMobileMenu}
      onToggleMobileMenu={handleToggleMobileMenu}
    >
      <div className="flex flex-col h-screen">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={handleSearchClear}
          onAddTask={handleAddTask}
          currentListName={currentListName}
        />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {showTaskForm ? (
                <TaskForm
                  key="task-form"
                  task={editingTask}
                  listId={activeListId !== "all" ? activeListId : undefined}
                  onSave={handleTaskSaved}
                  onCancel={() => setShowTaskForm(false)}
                />
              ) : (
                <TaskList
                  key="task-list"
                  listId={activeListId}
                  filters={filters}
                  searchQuery={searchQuery}
                  onEditTask={handleEditTask}
                  onTaskAdded={handleTaskSaved}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;