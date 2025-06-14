
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

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
  process: row.process || "",
  strengths: row.strengths || "",
  observations: row.observations || "",
  categoryId: row.category_id || "",
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

  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change received!', payload);
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      
      const optimisticProduct: Product = {
        id: `optimistic-${Date.now()}`,
        title: newProduct.title,
        process: newProduct.process || "",
        strengths: newProduct.strengths || "",
        observations: newProduct.observations || "",
        categoryId: newProduct.categoryId || "",
        companyId: newProduct.companyId,
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData<Product[]>(['products'], (old = []) => 
        [...old, optimisticProduct].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );

      return { previousProducts };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
          const newData = (oldData || []).filter(p => !p.id.startsWith('optimistic-'));
          return [...newData, data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Error al crear el producto",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      
      queryClient.setQueryData<Product[]>(['products'], (old = []) => 
        old.map(product => 
          product.id === updatedProduct.id ? { ...product, ...updatedProduct, updatedAt: new Date() } : product
        )
      );

      return { previousProducts };
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      
      queryClient.setQueryData<Product[]>(['products'], (old = []) => 
        old.filter(product => product.id !== idToDelete)
      );

      return { previousProducts };
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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

