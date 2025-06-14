
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Delegation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useDelegations = () => {
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDelegations = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated');
        setDelegations([]);
        return;
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

      setDelegations(delegationsData);
      console.log('Delegations fetched successfully:', delegationsData);
    } catch (error) {
      console.error('Error fetching delegations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las delegaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDelegation = async (delegationData: {
    name: string;
    legalName: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    contactPerson: string;
  }) => {
    try {
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
          user_id: user.id, // Set the current user's ID
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating delegation:', error);
        throw error;
      }

      toast({
        title: "Delegación creada",
        description: "La delegación ha sido creada exitosamente",
      });

      await fetchDelegations();
      return true;
    } catch (error) {
      console.error('Error creating delegation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la delegación",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDelegation = async (delegationId: string, updates: Partial<Delegation>) => {
    try {
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

      toast({
        title: "Delegación actualizada",
        description: "Los datos de la delegación han sido actualizados",
      });

      await fetchDelegations();
      return true;
    } catch (error) {
      console.error('Error updating delegation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la delegación",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDelegation = async (delegationId: string) => {
    try {
      console.log('Deleting delegation:', delegationId);
      
      const { error } = await supabase
        .from('delegations')
        .delete()
        .eq('id', delegationId);

      if (error) {
        console.error('Error deleting delegation:', error);
        throw error;
      }

      toast({
        title: "Delegación eliminada",
        description: "La delegación ha sido eliminada exitosamente",
      });

      await fetchDelegations();
      return true;
    } catch (error) {
      console.error('Error deleting delegation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la delegación",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDelegations();
  }, []);

  return {
    delegations,
    loading,
    createDelegation,
    updateDelegation,
    deleteDelegation,
    refetch: fetchDelegations,
  };
};
