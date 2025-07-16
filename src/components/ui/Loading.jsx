import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "tasks") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl p-4 border border-gray-100 animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded shimmer-bg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer-bg w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded shimmer-bg w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full shimmer-bg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "lists") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-3 rounded-lg animate-pulse"
          >
            <div className="w-5 h-5 bg-gray-200 rounded shimmer-bg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded shimmer-bg w-24"></div>
            </div>
            <div className="w-6 h-4 bg-gray-200 rounded shimmer-bg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;