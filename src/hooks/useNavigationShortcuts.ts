import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NavigationShortcut {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order_position: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type NavigationShortcutInput = Omit<NavigationShortcut, 'id' | 'created_at' | 'updated_at'>;

export const useNavigationShortcuts = () => {
  const { toast } = useToast();
  const [shortcuts, setShortcuts] = useState<NavigationShortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchShortcuts = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_shortcuts' as any)
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setShortcuts((data as unknown as NavigationShortcut[]) || []);
    } catch (error: any) {
      toast({
        title: "Error de navegación",
        description: "No se pudieron cargar los accesos directos. Intenta recargar la página o comunícate con soporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createShortcut = async (shortcut: NavigationShortcutInput) => {
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('navigation_shortcuts' as any)
        .insert([shortcut])
        .select()
        .single();

      if (error) throw error;

      setShortcuts(prev => [...prev, data as unknown as NavigationShortcut]);
      toast({
        title: "Acceso directo creado",
        description: "El acceso directo se ha creado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al crear acceso directo",
        description: error?.message || "No se pudo crear el acceso directo",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const updateShortcut = async (id: string, updates: Partial<NavigationShortcutInput>) => {
    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('navigation_shortcuts' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setShortcuts(prev => prev.map(s => s.id === id ? data as unknown as NavigationShortcut : s));
      toast({
        title: "Acceso directo actualizado",
        description: "El acceso directo se ha actualizado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al actualizar acceso directo",
        description: error?.message || "No se pudo actualizar el acceso directo",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const deleteShortcut = async (id: string) => {
    try {
      const { error } = await supabase
        .from('navigation_shortcuts' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setShortcuts(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Acceso directo eliminado",
        description: "El acceso directo se ha eliminado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar acceso directo",
        description: error?.message || "No se pudo eliminar el acceso directo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  return {
    shortcuts,
    loading,
    creating,
    updating,
    createShortcut,
    updateShortcut,
    deleteShortcut,
    refetch: fetchShortcuts,
  };
};
