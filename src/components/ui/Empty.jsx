import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  actionText = "Create New",
  onAction,
  icon = "Plus",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="button-gradient text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2 shadow-lg"
        >
          <ApperIcon name={icon} className="w-5 h-5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;