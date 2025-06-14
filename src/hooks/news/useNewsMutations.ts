
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNewsOperations } from '@/hooks/useNewsOperations';
import { CreateNewsData } from './types';

export const useNewsMutations = () => {
  const { toast } = useToast();
  const { createNewsRelations, updateNewsRelations } = useNewsOperations();
  const queryClient = useQueryClient();

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
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation
  };
};
