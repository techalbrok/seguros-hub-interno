
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { DepartmentContent } from './types';

export const useDepartmentContentQueries = (departmentId?: string) => {
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

  return {
    content,
    loading,
    error
  };
};
