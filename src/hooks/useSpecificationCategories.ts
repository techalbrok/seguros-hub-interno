
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateCategoryData {
  company_id: string;
  name: string;
  order_position?: number;
}

interface UpdateCategoryData {
  id: string;
  name?: string;
  order_position?: number;
}

export const useSpecificationCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: CreateCategoryData) => {
      const { data, error } = await supabase
        .from("specification_categories")
        .insert(categoryData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Categoría creada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría.",
        variant: "destructive",
      });
      console.error("Error creating category:", error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateCategoryData) => {
      const { data, error } = await supabase
        .from("specification_categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Categoría actualizada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría.",
        variant: "destructive",
      });
      console.error("Error updating category:", error);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("specification_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Categoría eliminada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría.",
        variant: "destructive",
      });
      console.error("Error deleting category:", error);
    },
  });

  return {
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
