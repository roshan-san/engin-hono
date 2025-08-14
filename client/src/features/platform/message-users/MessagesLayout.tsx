import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationsList } from "./ConversationsList";
import { ChatWindow } from "./ChatWindow";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export function MessagesLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  
  // Extract username from URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'message') {
      setSelectedUsername(pathParts[2]);
    } else {
      setSelectedUsername(null);
    }
  }, [location.pathname]);

  // Determine if we're in a chat view
  const isInChatView = selectedUsername !== null;

  const handleSelectConversation = (username: string) => {
    navigate({ to: '/message/$username', params: { username } });
  };

  const handleBackToList = () => {
    navigate({ to: '/message' });
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 bg-muted/10">
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
        <MessageCircle className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">Select a conversation</h3>
      <p className="text-sm text-center max-w-sm mb-4">
        Choose a chat from the list to start messaging, or connect with new people to begin conversations.
      </p>
      <Button 
        variant="outline" 
        onClick={() => navigate({ to: '/network' })}
        className="mt-2"
      >
        Find People to Connect
      </Button>
    </div>
  );

  return (
    <div className="h-full flex bg-background">
      {/* Mobile: Show either list or chat */}
      <div className="md:hidden h-full w-full">
        {isInChatView ? (
          selectedUsername ? (
            <ChatWindow 
              username={selectedUsername} 
              onBack={handleBackToList}
            />
          ) : (
            <EmptyState />
          )
        ) : (
          <ConversationsList
            selectedUsername={selectedUsername || undefined}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </div>

      {/* Desktop: Show both side by side */}
      <div className="hidden md:flex h-full w-full">
        {/* Sidebar - Always visible on desktop */}
        <div className="w-80 flex-shrink-0">
          <ConversationsList
            selectedUsername={selectedUsername || undefined}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {isInChatView && selectedUsername ? (
            <ChatWindow username={selectedUsername} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}