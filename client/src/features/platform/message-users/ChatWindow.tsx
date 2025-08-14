import { useMutation, useQuery, usePaginatedQuery } from "convex/react";
import { useRef, useEffect, useState } from "react";
import { ArrowLeft, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@/features/authentication/useUser";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  username: string;
  onBack?: () => void;
}

export function ChatWindow({ username, onBack }: ChatWindowProps) {
  const { profile: myProfile } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  // Get chat partner profile
  const chatPartner = useQuery(api.profile.queries.getProfileByUsername, { username });

  // Use Convex's built-in pagination for messages
  const { results: messages, status, loadMore } = usePaginatedQuery(
    api.messages.queries.getMessages,
    chatPartner ? { otherUserId: chatPartner._id } : "skip",
    { initialNumItems: 50 }
  );

  // Mutations
  const sendMessage = useMutation(api.messages.mutations.sendMessage);
  const markAllMessagesAsRead = useMutation(api.messages.mutations.markAllMessagesAsRead);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (chatPartner && messages && messages.length > 0) {
      markAllMessagesAsRead({ senderId: chatPartner._id });
    }
  }, [chatPartner, messages, markAllMessagesAsRead]);

  // Auto-scroll to bottom for new messages (not when loading older ones)
  useEffect(() => {
    if (status !== "LoadingMore" && !isScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status, isScrolledUp]);

  // Handle scroll to load older messages
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsScrolledUp(!isAtBottom);

    // Load more when scrolling to top
    if (scrollTop < 100 && status === "CanLoadMore") {
      loadMore(50);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!chatPartner) return;
    
    await sendMessage({
      receiverId: chatPartner._id,
      content,
      type: "text"
    });
  };

  const shouldShowAvatar = (messageIndex: number) => {
    if (!messages) return false;
    const message = messages[messageIndex];
    const nextMessage = messages[messageIndex + 1];
    
    // Show avatar if it's the last message from this sender or next message is from different sender
    return !nextMessage || nextMessage.senderId !== message.senderId;
  };

  if (!myProfile || !chatPartner) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <Avatar className="w-10 h-10">
          <AvatarImage src={chatPartner.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {chatPartner.name?.charAt(0) || chatPartner.username?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">
            {chatPartner.name || chatPartner.username}
          </h2>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              chatPartner.isOnline ? "bg-green-500" : "bg-gray-400"
            )} />
            <p className="text-sm text-muted-foreground truncate">
              {chatPartner.isOnline ? "Online" : `@${chatPartner.username}`}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="flex flex-col gap-1 p-4">
          {/* Load more indicator */}
          {status === "LoadingMore" && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading older messages...</span>
              </div>
            </div>
          )}
          
          {/* Beginning of conversation */}
          {status === "Exhausted" && messages && messages.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                Beginning of conversation
              </div>
            </div>
          )}

          {/* Messages */}
          {messages?.map((message, index) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === myProfile._id}
              showAvatar={shouldShowAvatar(index)}
              chatPartner={chatPartner}
            />
          ))}
          
          {/* Empty state */}
          {messages && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chatPartner.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {chatPartner.name?.charAt(0) || chatPartner.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="font-semibold mb-2">
                Start a conversation with {chatPartner.name || chatPartner.username}
              </h3>
              <p className="text-muted-foreground text-sm">
                Say hello and get the conversation started!
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder={`Message ${chatPartner.name || chatPartner.username}...`}
      />
      
      {/* Scroll to bottom button */}
      {isScrolledUp && (
        <Button
          onClick={() => {
            setIsScrolledUp(false);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          size="icon"
          className="fixed bottom-24 right-6 rounded-full shadow-lg z-10"
        >
          <ArrowLeft className="w-4 h-4 rotate-[-90deg]" />
        </Button>
      )}
    </div>
  );
}