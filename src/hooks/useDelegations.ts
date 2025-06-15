
import { useQueryClient } from "@tanstack/react-query";
import { useDelegationsQuery } from './delegations/useDelegationsQuery';
import { useDelegationMutations } from './delegations/useDelegationMutations';
import { Delegation } from '@/types';
import { useDemoMode } from "./useDemoMode";
import { v4 as uuidv4 } from 'uuid';

export const useDelegations = () => {
  const { isDemo, demoData, setDemoData } = useDemoMode();

  if (isDemo) {
    const createDelegation = async (data: any) => {
      const newDelegation: Delegation = {
        ...data,
        id: `demo-delegation-${uuidv4()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDemoData({ ...demoData, delegations: [...demoData.delegations, newDelegation] });
      return true;
    };

    const updateDelegation = async (delegationId: string, updates: Partial<Delegation>) => {
      setDemoData({
        ...demoData,
        delegations: demoData.delegations.map(d =>
          d.id === delegationId ? { ...d, ...updates, updatedAt: new Date() } : d
        ),
      });
      return true;
    };

    const deleteDelegation = async (delegationId: string) => {
      setDemoData({
        ...demoData,
        delegations: demoData.delegations.filter(d => d.id !== delegationId),
      });
      return true;
    };

    return {
      delegations: demoData.delegations,
      loading: false,
      error: null,
      createDelegation,
      updateDelegation,
      deleteDelegation,
      refetch: () => {},
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  }

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
