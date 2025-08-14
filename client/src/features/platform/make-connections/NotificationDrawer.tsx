import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileTube from "./ProfileTube";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function NotificationsDrawer() {
  const pendingNotifications = useQuery(
    api.connections.queries.getMyPendingConnections,
  );

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-10 w-10 p-0 hover:bg-muted/50 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          {pendingNotifications && pendingNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium animate-pulse">
              {pendingNotifications.length > 9 ? "9+" : pendingNotifications.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 h-full w-screen sm:w-3/4 sm:max-w-sm">
        <DrawerHeader className="border-b border-border/50">
          <DrawerTitle className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {pendingNotifications && pendingNotifications.length > 0 && (
              <span className="ml-auto h-6 w-6 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
                {pendingNotifications.length}
              </span>
            )}
          </DrawerTitle>
          <DrawerDescription>
            View and manage your connection requests
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pendingNotifications === undefined ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : pendingNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNotifications.map((connection: Doc<"connections">) => {
                return (
                  <div key={connection._id} className="animate-in slide-in-from-right-2 duration-300">
                    <ProfileTube
                      connectionId={connection._id}
                      profileId={connection.senderId}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
