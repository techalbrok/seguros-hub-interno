
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformDbRowToProduct } from "./utils";
import { useDemoMode } from "../useDemoMode";

export const useProductQueries = () => {
  const { isDemo, demoData } = useDemoMode();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", isDemo],
    queryFn: async () => {
      if (isDemo) {
        return demoData.products;
      }
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_documents (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(transformDbRowToProduct);
    },
  });

  return { products, isLoading: isDemo ? false : isLoading, error };
};
