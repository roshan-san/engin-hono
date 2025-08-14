import { cn } from "@/lib/utils";
import type { Doc } from "@/../convex/_generated/dataModel";

interface MessageBubbleProps {
  message: Doc<"messages">;
  isOwn: boolean;
  showAvatar?: boolean;
  chatPartner: Doc<"profiles">;
}

export function MessageBubble({ message, isOwn, showAvatar = false, chatPartner }: MessageBubbleProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-[85%]",
      isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
          {chatPartner.name?.charAt(0) || chatPartner.username?.charAt(0) || "?"}
        </div>
      )}
      
      {/* Message Content */}
      <div className={cn(
        "rounded-2xl px-4 py-2 break-words",
        isOwn 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-muted text-foreground rounded-bl-md"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isOwn ? "text-right" : "text-left"
        )}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}