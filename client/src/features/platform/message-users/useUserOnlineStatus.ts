import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

export function useUserOnlineStatus(userId: Id<"profiles"> | undefined) {
  const userProfile = useQuery(
    api.profile.queries.getProfileById, 
    userId ? { profileId: userId } : "skip"
  );

  if (!userProfile) {
    return {
      isOnline: false,
      lastActive: null,
      statusText: "Offline"
    };
  }

  const getOnlineStatus = () => {
    if (!userProfile.lastActive) return { isOnline: false, statusText: "Offline" };
    
    const now = Date.now();
    const lastActive = userProfile.lastActive;
    const minutesAgo = Math.floor((now - lastActive) / (1000 * 60));
    
    if (userProfile.isOnline && minutesAgo < 5) {
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

  const status = getOnlineStatus();

  return {
    isOnline: status.isOnline,
    lastActive: userProfile.lastActive,
    statusText: status.statusText
  };
}