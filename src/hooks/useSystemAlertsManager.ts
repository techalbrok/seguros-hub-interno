
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export type SystemAlert = Database['public']['Tables']['system_alerts']['Row'];
export type NewSystemAlert = Database['public']['Tables']['system_alerts']['Insert'];
export type UpdateSystemAlert = Database['public']['Tables']['system_alerts']['Update'];


const fetchAllSystemAlerts = async (): Promise<SystemAlert[]> => {
    const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all system alerts:', error);
        throw new Error(error.message);
    }
    return data || [];
};

export const useSystemAlertsManager = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    
    const { data: alerts = [], isLoading } = useQuery<SystemAlert[]>({
        queryKey: ['system_alerts_all'],
        queryFn: fetchAllSystemAlerts,
    });
    
    const createAlertMutation = useMutation({
        mutationFn: async (alert: NewSystemAlert) => {
            const { error } = await supabase.from('system_alerts').insert({ ...alert, created_by: user!.id });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system_alerts_all'] });
            queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
        },
    });
    
    const updateAlertMutation = useMutation({
        mutationFn: async ({ id, ...alert }: UpdateSystemAlert & { id: string }) => {
            const { error } = await supabase.from('system_alerts').update(alert).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system_alerts_all'] });
            queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
        },
    });

    const deleteAlertMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('system_alerts').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system_alerts_all'] });
            queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
        },
    });

    return {
        alerts,
        isLoading,
        createAlert: createAlertMutation.mutateAsync,
        updateAlert: updateAlertMutation.mutateAsync,
        deleteAlert: deleteAlertMutation.mutateAsync,
    };
};
