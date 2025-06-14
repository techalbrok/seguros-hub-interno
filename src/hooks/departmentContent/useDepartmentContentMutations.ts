
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DepartmentContent, CreateDepartmentContentData } from './types';

export const useDepartmentContentMutations = (content: DepartmentContent[]) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createContentMutation = useMutation({
    mutationFn: async (contentData: CreateDepartmentContentData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('department_content')
        .insert([{
          ...contentData,
          author_id: user.id,
          published_at: contentData.published ? new Date().toISOString() : null
        }])
        .select(`
          *,
          departments(id, name),
          profiles(id, name)
        `)
        .single();

      if (error) throw error;
      return data as DepartmentContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department-content"] });
      toast({
        title: "Éxito",
        description: "Contenido creado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear el contenido",
        variant: "destructive",
      });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DepartmentContent> }) => {
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.published && !content.find(c => c.id === id)?.published) {
        updateData.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('department_content')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          departments(id, name),
          profiles(id, name)
        `)
        .single();

      if (error) throw error;
      return data as DepartmentContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department-content"] });
      toast({
        title: "Éxito",
        description: "Contenido actualizado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el contenido",
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('department_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department-content"] });
      toast({
        title: "Éxito",
        description: "Contenido eliminado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el contenido",
        variant: "destructive",
      });
    },
  });

  const uploadImage = async (file: File) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('department-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('department-content')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    createContentMutation,
    updateContentMutation,
    deleteContentMutation,
    uploadImage
  };
};
