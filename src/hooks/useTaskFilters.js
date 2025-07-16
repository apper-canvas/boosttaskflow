import { useState, useMemo } from "react";
import { isToday, isTomorrow, isPast } from "date-fns";

export const useTaskFilters = (tasks) => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: "all",
    searchQuery: ""
  });

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(task => {
        if (filters.status === "completed") return task.completed;
        if (filters.status === "active") return !task.completed;
        return true;
      });
    }

    // Filter by priority
    if (filters.priority !== "all") {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        
        switch (filters.dateRange) {
          case "today":
            return dueDate >= today && dueDate < tomorrow;
          case "week":
            return dueDate >= today && dueDate < weekFromNow;
          case "overdue":
            return dueDate < today && !task.completed;
          default:
            return true;
        }
      });
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filters]);

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      dateRange: "all",
      searchQuery: ""
    });
  };

  return {
    filters,
    filteredTasks,
    updateFilter,
    clearFilters
  };
};