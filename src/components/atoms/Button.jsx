import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  variant = "primary", 
  size = "md",
  className,
  children,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "button-gradient text-white shadow-lg hover:shadow-xl",
    secondary: "bg-surface text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-error text-white hover:bg-error/90"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;