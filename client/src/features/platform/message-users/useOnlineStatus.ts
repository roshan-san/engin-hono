import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export function useOnlineStatus() {
  const data = useQuery(api.auth.getUser);
  const profile = data?.profile;
  const updatePresence = useMutation(api.profile.mutations.updatePresence);
  const setOffline = useMutation(api.profile.mutations.setOffline);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!profile) return;

    // Set user as online when hook mounts
    updatePresence({ isOnline: true });

    // Heartbeat every 30 seconds to keep user online
    const startHeartbeat = () => {
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          updatePresence({ isOnline: true });
        }
      }, 30000); // 30 seconds
    };

    // Track user activity
    const handleActivity = () => {
      isActiveRef.current = true;
      updatePresence({ isOnline: true });
    };

    // Track when user becomes inactive (no mouse/keyboard activity)
    let inactivityTimer: NodeJS.Timeout;
    const handleUserActivity = () => {
      handleActivity();
      clearTimeout(inactivityTimer);
      
      // Mark as inactive after 5 minutes of no activity
      inactivityTimer = setTimeout(() => {
        isActiveRef.current = false;
      }, 5 * 60 * 1000); // 5 minutes
    };

    // Listen for user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Handle visibility change (tab focus/blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false;
        // Don't immediately set offline, just stop being active
      } else {
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle page unload (user closes tab/browser)
    const handleBeforeUnload = () => {
      setOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Start the heartbeat
    startHeartbeat();
    handleUserActivity(); // Initial activity

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(inactivityTimer);
      
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Set user offline when component unmounts
      setOffline();
    };
  }, [profile, updatePresence, setOffline]);

  return {
    isTracking: !!profile
  };
}