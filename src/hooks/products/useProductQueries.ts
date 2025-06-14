
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformDbRowToProduct } from "./utils";

export const useProductQueries = () => {
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

  return { products, isLoading, error };
};
