
import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string | null;
  is_read: boolean;
  created_at: string;
}

const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(['notifications', user?.id], (oldData: Notification[] | undefined) => 
        oldData ? oldData.map(n => n.id === notificationId ? { ...n, is_read: true } : n) : []
      );
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id], exact: true });
    },
  });
  
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
       const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user!.id)
        .eq('is_read', false);
        
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
       queryClient.setQueryData(['notifications', user?.id], (oldData: Notification[] | undefined) => 
        oldData ? oldData.map(n => ({ ...n, is_read: true })) : []
      );
       queryClient.invalidateQueries({ queryKey: ['notifications', user?.id], exact: true });
    },
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:notifications')
      .on<Notification>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.setQueryData(['notifications', user.id], (oldData: Notification[] | undefined) => {
            return oldData ? [payload.new, ...oldData] : [payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = useCallback((notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if(notification && !notification.is_read) {
        markAsReadMutation.mutate(notificationId);
    }
  }, [markAsReadMutation, notifications]);
  
  const markAllAsRead = useCallback(() => {
    if (unreadCount > 0) {
      markAllAsReadMutation.mutate();
    }
  }, [markAllAsReadMutation, unreadCount]);

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
};
