
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
      console.log('Creating news with data:', newsData);
      
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

      console.log('News created successfully:', newsItem);
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
      console.log('Updating news with ID:', id, 'Data:', newsData);
      
      // Preparar los datos para la actualización
      const updateData: any = {};
      
      if (newsData.title !== undefined) updateData.title = newsData.title;
      if (newsData.content !== undefined) updateData.content = newsData.content;
      if (newsData.featured_image !== undefined) updateData.featured_image = newsData.featured_image;
      if (newsData.published !== undefined) {
        updateData.published = newsData.published;
        updateData.published_at = newsData.published ? new Date().toISOString() : null;
      }
      
      updateData.updated_at = new Date().toISOString();

      console.log('Prepared update data:', updateData);

      const { error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating news:', error);
        throw error;
      }

      console.log('News updated successfully');
      
      // Actualizar las relaciones
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
      console.log('Deleting news with ID:', id);
      
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news:', error);
        throw error;
      }
      
      console.log('News deleted successfully');
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
