
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Department {
  id: string;
  name: string;
  responsible_name: string;
  responsible_email?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Error al cargar los departamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([departmentData])
        .select()
        .single();

      if (error) throw error;

      setDepartments(prev => [...prev, data]);
      toast({
        title: "Éxito",
        description: "Departamento creado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear el departamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('departments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDepartments(prev => prev.map(dept => dept.id === id ? data : dept));
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el departamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDepartment = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDepartments(prev => prev.filter(dept => dept.id !== id));
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el departamento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};
