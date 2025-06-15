import { useQueryClient } from "@tanstack/react-query";
import { User } from '@/types';
import { useUserQueries } from './useUserQueries';
import { useUserMutations } from './useUserMutations';
import { CreateUserData, UpdateUserData } from './types';
import { useDemoMode } from "../useDemoMode";
import { v4 as uuidv4 } from 'uuid';

export const useUsers = () => {
  const { isDemo, demoData, setDemoData } = useDemoMode();

  if (isDemo) {
    const createUser = async (data: CreateUserData) => {
      const newUser: User = {
        id: `demo-user-${uuidv4()}`,
        name: data.name,
        email: data.email,
        delegation_id: data.delegationId,
        role: data.role,
        avatar_url: '/placeholder.svg',
        created_at: new Date().toISOString(),
      };
      setDemoData({ ...demoData, users: [...demoData.users, newUser] });
      return true;
    };

    const updateUser = async (userId: string, updates: Partial<User>) => {
      setDemoData({
        ...demoData,
        users: demoData.users.map(u => u.id === userId ? { ...u, ...updates } : u),
      });
      return true;
    };
    
    const deleteUser = async (userId: string) => {
      setDemoData({
        ...demoData,
        users: demoData.users.filter(u => u.id !== userId),
      });
      return true;
    };

    return {
      users: demoData.users,
      delegations: demoData.delegations,
      loading: false,
      error: null,
      createUser,
      updateUser,
      deleteUser,
      refetch: () => {},
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  }

  const queryClient = useQueryClient();
  const { users, delegations, loading, error } = useUserQueries();
  const { createUserMutation, updateUserMutation, deleteUserMutation } = useUserMutations();

  return {
    users,
    delegations,
    loading,
    error,
    createUser: async (data: CreateUserData) => {
      try {
        await createUserMutation.mutateAsync(data);
        return true;
      } catch (error) {
        return false;
      }
    },
    updateUser: async (userId: string, updates: Partial<User>) => {
      try {
        await updateUserMutation.mutateAsync({ userId, updates });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteUser: async (userId: string) => {
      try {
        await deleteUserMutation.mutateAsync(userId);
        return true;
      } catch (error) {
        return false;
      }
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
