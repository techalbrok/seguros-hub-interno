
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { News } from './types';

export const useNewsQueries = () => {
  const {
    data: news = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      console.log("Fetching news...");
      
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          profiles (name, email),
          news_companies (
            companies (id, name)
          ),
          news_categories (
            product_categories (id, name)
          ),
          news_products (
            products (id, title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }

      const processedNews = data?.map(item => ({
        ...item,
        companies: item.news_companies?.map(nc => nc.companies).filter(Boolean) || [],
        categories: item.news_categories?.map(nc => nc.product_categories).filter(Boolean) || [],
        products: item.news_products?.map(np => np.products).filter(Boolean) || []
      })) || [];

      console.log("News fetched successfully:", processedNews);
      return processedNews as News[];
    },
  });

  return {
    news,
    loading,
    error
  };
};
