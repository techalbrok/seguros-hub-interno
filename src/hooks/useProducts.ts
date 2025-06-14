
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductDocument } from "@/types";

interface CreateProductData {
  title: string;
  process?: string;
  strengths?: string;
  observations?: string;
  categoryId?: string;
  companyId?: string;
}

interface UpdateProductData extends CreateProductData {
  id: string;
}

// Transform database row to Product interface
const transformDbRowToProduct = (row: any): Product => ({
  id: row.id,
  title: row.title,
  process: row.process,
  strengths: row.strengths,
  observations: row.observations,
  categoryId: row.category_id,
  companyId: row.company_id,
  documents: row.product_documents || [],
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const useProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...");
      
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_documents (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products fetched successfully:", data);
      return data.map(transformDbRowToProduct);
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      console.log("Creating product:", productData);
      
      const { data, error } = await supabase
        .from("products")
        .insert([{
          title: productData.title,
          process: productData.process,
          strengths: productData.strengths,
          observations: productData.observations,
          category_id: productData.categoryId,
          company_id: productData.companyId,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        throw error;
      }

      return transformDbRowToProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Error al crear el producto",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (productData: UpdateProductData) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          title: productData.title,
          process: productData.process,
          strengths: productData.strengths,
          observations: productData.observations,
          category_id: productData.categoryId,
          company_id: productData.companyId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productData.id)
        .select()
        .single();

      if (error) throw error;
      return transformDbRowToProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      });
    },
  });

  return {
    products,
    isLoading,
    error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
