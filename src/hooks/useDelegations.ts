
import { useQueryClient } from "@tanstack/react-query";
import { useDelegationsQuery } from './delegations/useDelegationsQuery';
import { useDelegationMutations } from './delegations/useDelegationMutations';
import { Delegation } from '@/types';

export const useDelegations = () => {
  const queryClient = useQueryClient();
  const { data: delegations, isLoading: loading, error } = useDelegationsQuery();
  const { createDelegationMutation, updateDelegationMutation, deleteDelegationMutation } = useDelegationMutations();

  const createDelegation = async (data: any) => {
    try {
      await createDelegationMutation.mutateAsync(data);
      return true;
    } catch (error) {
      console.error('Error creating delegation:', error);
      return false;
    }
  };

  const updateDelegation = async (delegationId: string, updates: Partial<Delegation>) => {
    try {
      await updateDelegationMutation.mutateAsync({ delegationId, updates });
      return true;
    } catch (error) {
      console.error('Error updating delegation:', error);
      return false;
    }
  };

  const deleteDelegation = async (delegationId: string) => {
    try {
      await deleteDelegationMutation.mutateAsync(delegationId);
      return true;
    } catch (error) {
      console.error('Error deleting delegation:', error);
      return false;
    }
  };

  return {
    delegations,
    loading,
    error,
    createDelegation,
    updateDelegation,
    deleteDelegation,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["delegations"] }),
    isCreating: createDelegationMutation.isPending,
    isUpdating: updateDelegationMutation.isPending,
    isDeleting: deleteDelegationMutation.isPending,
  };
};
