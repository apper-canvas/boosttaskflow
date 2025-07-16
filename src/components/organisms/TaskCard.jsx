import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import PriorityBadge from "@/components/molecules/PriorityBadge";

const TaskCard = React.forwardRef(({ 
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
  ...props 
}, ref) => {
  const formatDueDate = (date) => {
    if (!date) return null;
    
    const taskDate = new Date(date);
    if (isToday(taskDate)) return "Today";
    if (isTomorrow(taskDate)) return "Tomorrow";
    if (isPast(taskDate)) return "Overdue";
    return format(taskDate, "MMM dd");
  };

  const getDueDateColor = (date) => {
    if (!date) return "text-gray-500";
    
    const taskDate = new Date(date);
    if (isPast(taskDate) && !isToday(taskDate)) return "text-error";
    if (isToday(taskDate)) return "text-warning";
    return "text-gray-500";
  };

return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-white rounded-xl p-4 border border-gray-100 shadow-card card-hover transition-all duration-200",
        task.completed && "opacity-60",
        className
      )}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.Id)}
          className="mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={cn(
              "font-medium text-gray-900 mb-1",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-2">
              <PriorityBadge priority={task.priority} />
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onDelete(task.Id)}
                  className="p-1 rounded-lg text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mb-2",
              task.completed && "line-through text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                <span className={cn(
                  "text-sm",
                  getDueDateColor(task.dueDate)
                )}>
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            )}
            
            {task.completed && task.completedAt && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
                <span className="text-sm text-success">
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
</motion.div>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;