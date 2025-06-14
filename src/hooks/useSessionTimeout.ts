
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const channel = new BroadcastChannel('session-activity');

export const useSessionTimeout = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    if (!user) return;
    signOut({ quiet: true }).then((success) => {
      if (success) {
        toast({
          title: "Sesión cerrada por inactividad",
          description: "Por tu seguridad, hemos cerrado la sesión automáticamente.",
        });
      }
    });
  }, [signOut, toast, user]);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(logout, TIMEOUT_DURATION);
  }, [logout]);

  const handleActivity = useCallback(() => {
    // Notify other tabs and reset timer in current tab
    channel.postMessage('activity');
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data === 'activity') {
        resetTimer();
      }
    };

    if (user) {
      // Listen for activity from other tabs
      channel.addEventListener('message', handleChannelMessage);
      
      // Listen for activity in the current tab
      const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
      events.forEach(event => window.addEventListener(event, handleActivity));
      
      resetTimer();

      return () => {
        events.forEach(event => window.removeEventListener(event, handleActivity));
        channel.removeEventListener('message', handleChannelMessage);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    } else {
      // Clean up timer if user logs out
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    }
  }, [user, handleActivity, resetTimer]);
};
