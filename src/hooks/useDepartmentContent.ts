
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface DepartmentContent {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  department_id: string;
  author_id: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  departments?: {
    id: string;
    name: string;
  };
  profiles?: {
    id: string;
    name: string;
  };
}

export const useDepartmentContent = (departmentId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: content = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["department-content", departmentId],
    queryFn: async () => {
      console.log("Fetching department content...");
      
      let query = supabase
        .from('department_content')
        .select(`
          *,
          departments(id, name),
          profiles(id, name)
        `)
        .order('created_at', { ascending: false });

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching content:', error);
        throw error;
      }

      console.log("Department content fetched successfully:", data);
      return data as DepartmentContent[];
    },
  });

  const createContentMutation = useMutation({
    mutationFn: async (contentData: {
      title: string;
      content: string;
      department_id: string;
      featured_image?: string;
      published?: boolean;
    }) => {
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
    content,
    loading,
    error,
    fetchContent: () => queryClient.invalidateQueries({ queryKey: ["department-content"] }),
    createContent: (data: any) => createContentMutation.mutateAsync(data),
    updateContent: (id: string, updates: Partial<DepartmentContent>) => 
      updateContentMutation.mutateAsync({ id, updates }),
    deleteContent: deleteContentMutation.mutateAsync,
    uploadImage,
    isCreating: createContentMutation.isPending,
    isUpdating: updateContentMutation.isPending,
    isDeleting: deleteContentMutation.isPending,
  };
};
