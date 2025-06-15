import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDemoMode } from "./useDemoMode";
import { v4 as uuidv4 } from 'uuid';

export interface Department {
  id: string;
  name: string;
  responsibleName: string;
  responsibleEmail?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const fromDepartment = (department: Partial<Department>) => ({
    name: department.name,
    responsible_name: department.responsibleName,
    responsible_email: department.responsibleEmail,
    description: department.description,
});

export const useDepartments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isDemo, demoData, setDemoData } = useDemoMode();

  const {
    data: departments = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["departments", isDemo],
    queryFn: async (): Promise<Department[]> => {
      if (isDemo) {
        return demoData.departments;
      }
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
      return data.map(d => ({
          id: d.id,
          name: d.name,
          responsibleName: d.responsible_name,
          responsibleEmail: d.responsible_email,
          description: d.description,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
      }));
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (isDemo) {
        const newDepartment: Department = {
          ...departmentData,
          id: `demo-dept-${uuidv4()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDemoData({ ...demoData, departments: [...demoData.departments, newDepartment] });
        return newDepartment;
      }
      console.log("Creating department:", departmentData);
      
      const { data, error } = await supabase
        .from('departments')
        .insert([fromDepartment(departmentData)])
        .select()
        .single();

      if (error) {
        console.error("Error creating department:", error);
        throw error;
      }

      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", isDemo] });
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
      if (isDemo) {
        const updatedDepartment = { ...demoData.departments.find(d => d.id === id), ...updates, updatedAt: new Date().toISOString() } as Department;
        setDemoData({
          ...demoData,
          departments: demoData.departments.map(d => d.id === id ? updatedDepartment : d),
        });
        return updatedDepartment;
      }
      const { data, error } = await supabase
        .from('departments')
        .update({ ...fromDepartment(updates), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", isDemo] });
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
      if (isDemo) {
        setDemoData({ ...demoData, departments: demoData.departments.filter(d => d.id !== id) });
        return;
      }
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", isDemo] });
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
    loading: isDemo ? false : loading,
    error,
    fetchDepartments: () => queryClient.invalidateQueries({ queryKey: ["departments", isDemo] }),
    createDepartment: async (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await createDepartmentMutation.mutateAsync(data);
        return true;
      } catch (error) {
        return false;
      }
    },
    updateDepartment: async (id: string, updates: Partial<Department>) => {
      try {
        await updateDepartmentMutation.mutateAsync({ id, updates });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteDepartment: async (id: string) => {
      try {
        await deleteDepartmentMutation.mutateAsync(id);
        return true;
      } catch (error) {
        return false;
      }
    },
    isCreating: isDemo ? false : createDepartmentMutation.isPending,
    isUpdating: isDemo ? false : updateDepartmentMutation.isPending,
    isDeleting: isDemo ? false : deleteDepartmentMutation.isPending,
  };
};
