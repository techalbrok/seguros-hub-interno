
import { useQueryClient } from "@tanstack/react-query";
import { useDepartmentContentQueries } from './useDepartmentContentQueries';
import { useDepartmentContentMutations } from './useDepartmentContentMutations';
import { DepartmentContent, CreateDepartmentContentData } from './types';

export const useDepartmentContent = (departmentId?: string) => {
  const queryClient = useQueryClient();
  const { content, loading, error } = useDepartmentContentQueries(departmentId);
  const { 
    createContentMutation, 
    updateContentMutation, 
    deleteContentMutation, 
    uploadImage 
  } = useDepartmentContentMutations(content);

  return {
    content,
    loading,
    error,
    fetchContent: () => queryClient.invalidateQueries({ queryKey: ["department-content"] }),
    createContent: async (data: CreateDepartmentContentData) => {
      try {
        await createContentMutation.mutateAsync(data);
        return true;
      } catch (error) {
        return false;
      }
    },
    updateContent: async (id: string, updates: Partial<DepartmentContent>) => {
      try {
        await updateContentMutation.mutateAsync({ id, updates });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteContent: async (id: string) => {
      try {
        await deleteContentMutation.mutateAsync(id);
        return true;
      } catch (error) {
        return false;
      }
    },
    uploadImage,
    isCreating: createContentMutation.isPending,
    isUpdating: updateContentMutation.isPending,
    isDeleting: deleteContentMutation.isPending,
  };
};
