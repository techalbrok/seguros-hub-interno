
import { useQueryClient } from "@tanstack/react-query";
import { useNewsQueries } from './useNewsQueries';
import { useNewsMutations } from './useNewsMutations';
import { CreateNewsData } from './types';

export const useNews = () => {
  const queryClient = useQueryClient();
  const { news, loading, error } = useNewsQueries();
  const { createNewsMutation, updateNewsMutation, deleteNewsMutation } = useNewsMutations();

  return {
    news,
    loading,
    error,
    createNews: async (data: CreateNewsData) => {
      try {
        await createNewsMutation.mutateAsync(data);
        return true;
      } catch (error) {
        return false;
      }
    },
    updateNews: async (id: string, newsData: Partial<CreateNewsData>) => {
      try {
        await updateNewsMutation.mutateAsync({ id, newsData });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteNews: async (id: string) => {
      try {
        await deleteNewsMutation.mutateAsync(id);
        return true;
      } catch (error) {
        return false;
      }
    },
    refetch: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
    isCreating: createNewsMutation.isPending,
    isUpdating: updateNewsMutation.isPending,
    isDeleting: deleteNewsMutation.isPending,
  };
};
