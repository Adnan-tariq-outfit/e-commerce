import React, { HTMLAttributes } from "react";

// Helper function for simple class merging
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "purple" | "green" | "gray";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "gray", ...props }, ref) => {
    let variantStyles = "bg-gray-100 text-gray-800"; // default gray
    
    if (variant === "purple") {
      variantStyles = "bg-[#F3F0FF] text-[#7E5CEF]";
    } else if (variant === "green") {
      variantStyles = "bg-[#E6F8F0] text-[#1DBB7B]";
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
          variantStyles,
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
