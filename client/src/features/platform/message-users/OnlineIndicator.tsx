import { cn } from "@/lib/utils";
import { useUserOnlineStatus } from "./useUserOnlineStatus";
import type { Id } from "@/../convex/_generated/dataModel";

interface OnlineIndicatorProps {
  userId: Id<"profiles">;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function OnlineIndicator({ 
  userId, 
  size = "md", 
  showText = false, 
  className 
}: OnlineIndicatorProps) {
  const { isOnline, statusText } = useUserOnlineStatus(userId);

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full border-2 border-background",
        sizeClasses[size],
        isOnline ? "bg-green-500" : "bg-gray-400"
      )} />
      
      {showText && (
        <span className={cn(
          "text-muted-foreground",
          size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs"
        )}>
          {statusText}
        </span>
      )}
    </div>
  );
}