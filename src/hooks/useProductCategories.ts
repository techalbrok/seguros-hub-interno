
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProductCategory } from "@/types";

interface CreateCategoryData {
  name: string;
  parentId?: string;
  level: number;
}

interface UpdateCategoryData extends CreateCategoryData {
  id: string;
}

// Transform database row to ProductCategory interface
const transformDbRowToCategory = (row: any): ProductCategory => ({
  id: row.id,
  name: row.name,
  parentId: row.parent_id,
  level: row.level,
  children: row.children || [],
  documents: row.category_documents || [],
});

export const useProductCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      console.log("Fetching product categories...");
      
      const { data, error } = await supabase
        .from("product_categories")
        .select(`
          *,
          category_documents (*)
        `)
        .order("level", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      console.log("Categories fetched successfully:", data);
      return data.map(transformDbRowToCategory);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: CreateCategoryData) => {
      console.log("Creating category:", categoryData);
      
      const { data, error } = await supabase
        .from("product_categories")
        .insert([{
          name: categoryData.name,
          parent_id: categoryData.parentId,
          level: categoryData.level,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating category:", error);
        throw error;
      }

      return transformDbRowToCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Error al crear la categoría",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: UpdateCategoryData) => {
      const { data, error } = await supabase
        .from("product_categories")
        .update({
          name: categoryData.name,
          parent_id: categoryData.parentId,
          level: categoryData.level,
          updated_at: new Date().toISOString(),
        })
        .eq("id", categoryData.id)
        .select()
        .single();

      if (error) throw error;
      return transformDbRowToCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la categoría",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la categoría",
        variant: "destructive",
      });
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
