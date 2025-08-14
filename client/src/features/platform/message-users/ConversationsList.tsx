import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Doc } from "@/../convex/_generated/dataModel";

interface ConversationsListProps {
  selectedUsername?: string;
  onSelectConversation: (username: string) => void;
}

const getOnlineStatus = (profile: Doc<"profiles">) => {
  if (!profile.lastActive) return { isOnline: false, statusText: "Offline" };
  
  const now = Date.now();
  const lastActive = profile.lastActive;
  const minutesAgo = Math.floor((now - lastActive) / (1000 * 60));
  
  if (profile.isOnline && minutesAgo < 5) {
    return { isOnline: true, statusText: "Online" };
  }
  
  if (minutesAgo < 5) return { isOnline: false, statusText: "Active now" };
  if (minutesAgo < 60) return { isOnline: false, statusText: `${minutesAgo}m ago` };
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return { isOnline: false, statusText: `${hoursAgo}h ago` };
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return { isOnline: false, statusText: `${daysAgo}d ago` };
  
  return { isOnline: false, statusText: "Long time ago" };
};

export function ConversationsList({ selectedUsername, onSelectConversation }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const conversations = useQuery(api.messages.queries.getConversations);
  const unreadCount = useQuery(api.messages.queries.getUnreadMessagesCount);

  const formatTime = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diff = now.getTime() - messageDate.getTime();
    
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations?.filter(conv => 
    conv.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherParticipant?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          {unreadCount && unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery 
                ? `No conversations match "${searchQuery}"`
                : "Start connecting with people to begin conversations"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => {
              if (!conversation.otherParticipant) return null;
              
              const isSelected = conversation.otherParticipant.username === selectedUsername;
              const hasUnread = conversation.unreadCount > 0;
              const onlineStatus = getOnlineStatus(conversation.otherParticipant);
              
              return (
                <div
                  key={conversation.conversationId}
                  onClick={() => onSelectConversation(conversation.otherParticipant!.username!)}
                  className={cn(
                    "flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200",
                    isSelected && "bg-primary/10 border-r-2 border-primary",
                    hasUnread && "bg-muted/20"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.otherParticipant.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {conversation.otherParticipant.name?.charAt(0) || 
                         conversation.otherParticipant.username?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online status indicator */}
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                      onlineStatus.isOnline ? "bg-green-500" : "bg-gray-400"
                    )} />
                    
                    {/* Unread badge */}
                    {hasUnread && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs h-5 px-1.5 min-w-[20px]">
                        {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-medium text-sm truncate",
                        hasUnread ? "font-semibold" : "font-normal"
                      )}>
                        {conversation.otherParticipant.name || conversation.otherParticipant.username}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-xs truncate flex-1",
                        hasUnread ? "font-medium text-foreground" : "text-muted-foreground"
                      )}>
                        {conversation.lastMessageContent || "No messages yet"}
                      </p>
                      
                      {!hasUnread && (
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {onlineStatus.statusText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}