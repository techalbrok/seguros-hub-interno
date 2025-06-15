
import { useQueryClient } from "@tanstack/react-query";
import { User } from '@/types';
import { useUserQueries } from './useUserQueries';
import { useUserMutations } from './useUserMutations';
import { CreateUserData } from './types';

export const useUsers = () => {
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
