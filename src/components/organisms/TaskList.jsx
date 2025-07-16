import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";

const TaskList = ({ 
  listId,
  filters,
  onEditTask,
  onTaskAdded,
  searchQuery = ""
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allTasks = await taskService.getAll();
      let filteredTasks = allTasks;

      // Filter by list
if (listId && listId !== "all") {
        filteredTasks = filteredTasks.filter(task => task.listId === listId.toString());
      }

      // Filter by search query
      if (searchQuery) {
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      if (filters.status !== "all") {
        filteredTasks = filteredTasks.filter(task => {
          if (filters.status === "completed") return task.completed;
          if (filters.status === "active") return !task.completed;
          return true;
        });
      }

      if (filters.priority !== "all") {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        filteredTasks = filteredTasks.filter(task => {
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

      // Sort tasks
      filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return a.order - b.order;
      });

      setTasks(filteredTasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [listId, filters, searchQuery]);

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      };

      await taskService.update(taskId, updatedTask);
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.Id === taskId ? updatedTask : t
        )
      );

      if (updatedTask.completed) {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as incomplete");
      }

      // Notify parent of task update
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
      
      // Notify parent of task deletion
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  if (tasks.length === 0) {
    if (searchQuery) {
      return (
        <Empty
          title="No tasks found"
          description={`No tasks match "${searchQuery}". Try adjusting your search.`}
          icon="Search"
        />
      );
    }

    return (
      <Empty
        title="No tasks yet"
        description="Ready to get organized? Create your first task and start being productive!"
        actionText="Add Your First Task"
        icon="Plus"
        onAction={() => onEditTask(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onEdit={onEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;