
import { useState, useEffect } from 'react';
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
  const [content, setContent] = useState<DepartmentContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchContent = async () => {
    try {
      setLoading(true);
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

      if (error) throw error;
      setContent(data || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Error al cargar el contenido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData: {
    title: string;
    content: string;
    department_id: string;
    featured_image?: string;
    published?: boolean;
  }) => {
    if (!user) return false;

    try {
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

      setContent(prev => [data, ...prev]);
      toast({
        title: "Éxito",
        description: "Contenido creado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear el contenido",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateContent = async (id: string, updates: Partial<DepartmentContent>) => {
    if (!user) return false;

    try {
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

      setContent(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Éxito",
        description: "Contenido actualizado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el contenido",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteContent = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('department_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Éxito",
        description: "Contenido eliminado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el contenido",
        variant: "destructive",
      });
      return false;
    }
  };

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

  useEffect(() => {
    fetchContent();
  }, [departmentId]);

  return {
    content,
    loading,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    uploadImage
  };
};
