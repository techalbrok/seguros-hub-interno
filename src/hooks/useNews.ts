
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNewsOperations } from './useNewsOperations';

export interface News {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
  companies?: Array<{
    id: string;
    name: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  products?: Array<{
    id: string;
    title: string;
  }>;
}

export interface CreateNewsData {
  title: string;
  content: string;
  featured_image?: string;
  published: boolean;
  company_ids?: string[];
  category_ids?: string[];
  product_ids?: string[];
}

export const useNews = () => {
  const { toast } = useToast();
  const { createNewsRelations, updateNewsRelations } = useNewsOperations();
  const queryClient = useQueryClient();

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

  const createNewsMutation = useMutation({
    mutationFn: async (newsData: CreateNewsData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: newsItem, error } = await supabase
        .from('news')
        .insert({
          title: newsData.title,
          content: newsData.content,
          featured_image: newsData.featured_image,
          author_id: user.id,
          published: newsData.published,
          published_at: newsData.published ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating news:', error);
        throw error;
      }

      await createNewsRelations(newsItem.id, newsData);
      return newsItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({
        title: "Éxito",
        description: "Noticia creada correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating news:', error);
      toast({
        title: "Error",
        description: "Error al crear la noticia",
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, newsData }: { id: string; newsData: Partial<CreateNewsData> }) => {
      const { error } = await supabase
        .from('news')
        .update({
          ...newsData,
          updated_at: new Date().toISOString(),
          published_at: newsData.published ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating news:', error);
        throw error;
      }

      await updateNewsRelations(id, newsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({
        title: "Éxito",
        description: "Noticia actualizada correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error updating news:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la noticia",
        variant: "destructive",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({
        title: "Éxito",
        description: "Noticia eliminada correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la noticia",
        variant: "destructive",
      });
    },
  });

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
