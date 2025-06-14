
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: departments = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      console.log("Fetching departments...");
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      console.log("Departments fetched successfully:", data);
      return data as Department[];
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
      console.log("Creating department:", departmentData);
      
      const { data, error } = await supabase
        .from('departments')
        .insert([departmentData])
        .select()
        .single();

      if (error) {
        console.error("Error creating department:", error);
        throw error;
      }

      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Éxito",
        description: "Departamento creado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear el departamento",
        variant: "destructive",
      });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Department> }) => {
      const { data, error } = await supabase
        .from('departments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el departamento",
        variant: "destructive",
      });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el departamento",
        variant: "destructive",
      });
    },
  });

  return {
    departments,
    loading,
    error,
    fetchDepartments: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
    createDepartment: (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
      return createDepartmentMutation.mutateAsync(data);
    },
    updateDepartment: (id: string, updates: Partial<Department>) => {
      return updateDepartmentMutation.mutateAsync({ id, updates });
    },
    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    isCreating: createDepartmentMutation.isPending,
    isUpdating: updateDepartmentMutation.isPending,
    isDeleting: deleteDepartmentMutation.isPending,
  };
};
