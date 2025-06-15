
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Delegation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";

export const useDelegationMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  const createDelegationMutation = useMutation({
    mutationFn: async (delegationData: {
      name: string;
      legalName: string;
      address: string;
      phone: string;
      email: string;
      website?: string;
      contactPerson: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('delegations')
        .insert({
          name: delegationData.name,
          legal_name: delegationData.legalName,
          address: delegationData.address,
          phone: delegationData.phone,
          email: delegationData.email,
          website: delegationData.website,
          contact_person: delegationData.contactPerson,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: `${t.singular} creada`,
        description: `La ${t.singular.toLowerCase()} ha sido creada exitosamente`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `No se pudo crear la ${t.singular.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const updateDelegationMutation = useMutation({
    mutationFn: async ({ delegationId, updates }: { delegationId: string; updates: Partial<Delegation> }) => {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.legalName !== undefined) updateData.legal_name = updates.legalName;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.website !== undefined) updateData.website = updates.website;
      if (updates.contactPerson !== undefined) updateData.contact_person = updates.contactPerson;
      if (updates.userId !== undefined) updateData.user_id = updates.userId;

      const { error } = await supabase
        .from('delegations')
        .update(updateData)
        .eq('id', delegationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: `${t.singular} actualizada`,
        description: `Los datos de la ${t.singular.toLowerCase()} han sido actualizados`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `No se pudo actualizar la ${t.singular.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const deleteDelegationMutation = useMutation({
    mutationFn: async (delegationId: string) => {
      const { error } = await supabase
        .from('delegations')
        .delete()
        .eq('id', delegationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: `${t.singular} eliminada`,
        description: `La ${t.singular.toLowerCase()} ha sido eliminada exitosamente`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `No se pudo eliminar la ${t.singular.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  return {
    createDelegationMutation,
    updateDelegationMutation,
    deleteDelegationMutation,
  };
};
