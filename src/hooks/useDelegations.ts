
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Delegation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useDelegations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: delegations = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["delegations"],
    queryFn: async () => {
      console.log("Fetching delegations...");
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated');
        return [];
      }

      const { data, error } = await supabase
        .from('delegations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching delegations:', error);
        throw error;
      }

      const delegationsData: Delegation[] = data?.map((delegation: any) => ({
        id: delegation.id,
        name: delegation.name,
        legalName: delegation.legal_name,
        address: delegation.address,
        phone: delegation.phone,
        email: delegation.email,
        website: delegation.website,
        contactPerson: delegation.contact_person,
        userId: delegation.user_id,
        createdAt: new Date(delegation.created_at),
        updatedAt: new Date(delegation.updated_at),
      })) || [];

      console.log('Delegations fetched successfully:', delegationsData);
      return delegationsData;
    },
  });

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
      console.log('Creating delegation:', delegationData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

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

      if (error) {
        console.error('Error creating delegation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: "Delegación creada",
        description: "La delegación ha sido creada exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating delegation:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la delegación",
        variant: "destructive",
      });
    },
  });

  const updateDelegationMutation = useMutation({
    mutationFn: async ({ delegationId, updates }: { delegationId: string; updates: Partial<Delegation> }) => {
      console.log('Updating delegation:', delegationId, updates);
      
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

      if (error) {
        console.error('Error updating delegation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: "Delegación actualizada",
        description: "Los datos de la delegación han sido actualizados",
      });
    },
    onError: (error: any) => {
      console.error('Error updating delegation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la delegación",
        variant: "destructive",
      });
    },
  });

  const deleteDelegationMutation = useMutation({
    mutationFn: async (delegationId: string) => {
      console.log('Deleting delegation:', delegationId);
      
      const { error } = await supabase
        .from('delegations')
        .delete()
        .eq('id', delegationId);

      if (error) {
        console.error('Error deleting delegation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegations"] });
      toast({
        title: "Delegación eliminada",
        description: "La delegación ha sido eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting delegation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la delegación",
        variant: "destructive",
      });
    },
  });

  return {
    delegations,
    loading,
    error,
    createDelegation: async (data: any) => {
      try {
        await createDelegationMutation.mutateAsync(data);
        return true;
      } catch (error) {
        return false;
      }
    },
    updateDelegation: async (delegationId: string, updates: Partial<Delegation>) => {
      try {
        await updateDelegationMutation.mutateAsync({ delegationId, updates });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteDelegation: async (delegationId: string) => {
      try {
        await deleteDelegationMutation.mutateAsync(delegationId);
        return true;
      } catch (error) {
        return false;
      }
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["delegations"] }),
    isCreating: createDelegationMutation.isPending,
    isUpdating: updateDelegationMutation.isPending,
    isDeleting: deleteDelegationMutation.isPending,
  };
};
