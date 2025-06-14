
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { CreateProductData, UpdateProductData } from "./types";
import { transformDbRowToProduct } from "./utils";

export const useProductMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      console.log("Creating product with documents:", productData);

      const { documents, ...productCoreData } = productData;

      // 1. Create the product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert([{
          title: productCoreData.title,
          process: productCoreData.process,
          strengths: productCoreData.strengths,
          observations: productCoreData.observations,
          category_id: productCoreData.categoryId,
          company_id: productCoreData.companyId,
        }])
        .select()
        .single();

      if (productError) {
        console.error("Error creating product:", productError);
        throw productError;
      }

      // 2. Upload documents if any
      if (documents && documents.length > 0) {
        const productId = newProduct.id;
        const uploadedDocuments = [];

        for (const file of documents) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${productId}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading document:', uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('product-documents')
            .getPublicUrl(fileName);

          uploadedDocuments.push({
            product_id: productId,
            name: file.name,
            url: urlData.publicUrl,
            type: file.type,
            size: file.size,
          });
        }

        // 3. Insert document records
        if (uploadedDocuments.length > 0) {
          const { error: docError } = await supabase
            .from('product_documents')
            .insert(uploadedDocuments);

          if (docError) {
            console.error('Error inserting product documents:', docError);
          }
        }
      }

      // 4. Refetch the full product with documents to return
      const { data: finalProduct, error: finalProductError } = await supabase
        .from("products")
        .select(`
          *,
          product_documents (*)
        `)
        .eq('id', newProduct.id)
        .single();
      
      if (finalProductError) {
        console.error("Error refetching product:", finalProductError);
        throw finalProductError;
      }
      
      return transformDbRowToProduct(finalProduct);
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
      const { documents, ...productCoreData } = productData;
    
      // 1. Update product details
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
      
      // 2. Upload and insert new documents
      if (documents && documents.length > 0) {
        const productId = productCoreData.id;
        const uploadedDocuments = [];

        for (const file of documents) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${productId}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading document:', uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('product-documents')
            .getPublicUrl(fileName);

          uploadedDocuments.push({
            product_id: productId,
            name: file.name,
            url: urlData.publicUrl,
            type: file.type,
            size: file.size,
          });
        }

        if (uploadedDocuments.length > 0) {
          const { error: docError } = await supabase
            .from('product_documents')
            .insert(uploadedDocuments);

          if (docError) {
            console.error('Error inserting product documents:', docError);
          }
        }
      }

      // 3. Refetch the full product with documents to return
      const { data: finalProduct, error: finalProductError } = await supabase
        .from("products")
        .select(`
          *,
          product_documents (*)
        `)
        .eq('id', productCoreData.id)
        .single();

      if (finalProductError) throw finalProductError;
      
      return transformDbRowToProduct(finalProduct);
    },
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((product) => {
          if (product.id === updatedProduct.id) {
            const { documents, ...productCoreData } = updatedProduct;
            return {
              ...product,
              ...productCoreData,
              documents: product.documents, // Keep existing documents for optimistic update
              updatedAt: new Date(),
            };
          }
          return product;
        })
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
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
