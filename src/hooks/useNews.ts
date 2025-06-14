
import { useState, useEffect } from 'react';
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
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { createNewsRelations, updateNewsRelations } = useNewsOperations();

  const fetchNews = async () => {
    try {
      setLoading(true);
      
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
        toast({
          title: "Error",
          description: "Error al cargar las noticias",
          variant: "destructive",
        });
        return;
      }

      const processedNews = data?.map(item => ({
        ...item,
        companies: item.news_companies?.map(nc => nc.companies).filter(Boolean) || [],
        categories: item.news_categories?.map(nc => nc.product_categories).filter(Boolean) || [],
        products: item.news_products?.map(np => np.products).filter(Boolean) || []
      })) || [];

      setNews(processedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Error al cargar las noticias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: CreateNewsData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Usuario no autenticado",
          variant: "destructive",
        });
        return false;
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
        toast({
          title: "Error",
          description: "Error al crear la noticia",
          variant: "destructive",
        });
        return false;
      }

      await createNewsRelations(newsItem.id, newsData);

      toast({
        title: "Éxito",
        description: "Noticia creada correctamente",
      });

      fetchNews();
      return true;
    } catch (error) {
      console.error('Error creating news:', error);
      toast({
        title: "Error",
        description: "Error al crear la noticia",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateNews = async (id: string, newsData: Partial<CreateNewsData>) => {
    try {
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
        toast({
          title: "Error",
          description: "Error al actualizar la noticia",
          variant: "destructive",
        });
        return false;
      }

      await updateNewsRelations(id, newsData);

      toast({
        title: "Éxito",
        description: "Noticia actualizada correctamente",
      });

      fetchNews();
      return true;
    } catch (error) {
      console.error('Error updating news:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la noticia",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news:', error);
        toast({
          title: "Error",
          description: "Error al eliminar la noticia",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Éxito",
        description: "Noticia eliminada correctamente",
      });

      fetchNews();
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la noticia",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    createNews,
    updateNews,
    deleteNews,
    refetch: fetchNews,
  };
};
