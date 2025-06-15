
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type SystemAlert = Database['public']['Tables']['system_alerts']['Row'];

const fetchSystemAlerts = async (): Promise<SystemAlert[]> => {
    const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching system alerts:', error);
        throw new Error(error.message);
    }
    return data || [];
};

export const useSystemAlerts = () => {
    const queryClient = useQueryClient();
    const { data: alerts = [], isLoading } = useQuery<SystemAlert[]>({
        queryKey: ['system_alerts'],
        queryFn: fetchSystemAlerts,
    });

    useEffect(() => {
        const channel = supabase
            .channel('public:system_alerts')
            .on<SystemAlert>(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'system_alerts' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return { alerts, isLoading };
};
