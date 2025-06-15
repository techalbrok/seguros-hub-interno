import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Company, CompanySpecification, SpecificationCategory } from "@/types";

export interface CreateCompanyData {
  name: string;
  commercialWebsite?: string;
  brokerAccess: string;
  commercialManager: string;
  managerEmail: string;
  isFeatured?: boolean;
}

interface UpdateCompanyData extends CreateCompanyData {
  id: string;
}

// Transform DB row to CompanySpecification interface
const transformDbRowToCompanySpecification = (row: any): CompanySpecification => ({
  id: row.id,
  companyId: row.company_id,
  title: row.title,
  categoryId: row.category_id,
  content: row.content,
  order: row.order_position,
  updatedAt: new Date(row.updated_at),
});

const transformDbRowToSpecificationCategory = (row: any): SpecificationCategory => ({
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    order: row.order_position,
});

// Transform database row to Company interface
const transformDbRowToCompany = (row: any): Company => ({
  id: row.id,
  name: row.name,
  commercialWebsite: row.commercial_website,
  brokerAccess: row.broker_access,
  commercialManager: row.commercial_manager,
  managerEmail: row.manager_email,
  isFeatured: row.is_featured,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  specifications: Array.isArray(row.company_specifications)
    ? row.company_specifications.map(transformDbRowToCompanySpecification)
    : [],
  specificationCategories: Array.isArray(row.specification_categories)
    ? row.specification_categories.map(transformDbRowToSpecificationCategory)
    : [],
});

export const useCompanies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      console.log("Fetching companies...");
      
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        console.log("User not authenticated");
        return [];
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*, company_specifications(*), specification_categories(*)")
        .order("name", { ascending: true })
        .order("order_position", { referencedTable: 'company_specifications', ascending: true })
        .order("order_position", { referencedTable: 'specification_categories', ascending: true });

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }

      console.log("Companies fetched successfully:", data);
      return data.map(transformDbRowToCompany);
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (companyData: CreateCompanyData) => {
      console.log("Creating company:", companyData);
      
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error("User must be authenticated to create companies");
      }

      const { data, error } = await supabase
        .from("companies")
        .insert([{
          name: companyData.name,
          commercial_website: companyData.commercialWebsite,
          broker_access: companyData.brokerAccess,
          commercial_manager: companyData.commercialManager,
          manager_email: companyData.managerEmail,
          is_featured: companyData.isFeatured,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating company:", error);
        throw error;
      }

      return transformDbRowToCompany(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Éxito",
        description: "Compañía creada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error creating company:", error);
      toast({
        title: "Error",
        description: "Error al crear la compañía",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (companyData: UpdateCompanyData) => {
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: companyData.name,
          commercial_website: companyData.commercialWebsite,
          broker_access: companyData.brokerAccess,
          commercial_manager: companyData.commercialManager,
          manager_email: companyData.managerEmail,
          is_featured: companyData.isFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", companyData.id)
        .select()
        .single();

      if (error) throw error;
      return transformDbRowToCompany(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Éxito",
        description: "Compañía actualizada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la compañía",
        variant: "destructive",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Éxito",
        description: "Compañía eliminada correctamente",
      });
    },
    onError: (error) => {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la compañía",
        variant: "destructive",
      });
    },
  });

  const bulkCreateCompaniesMutation = useMutation({
    mutationFn: async (companiesData: CreateCompanyData[]) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error("User must be authenticated to create companies");
      }

      const dataToInsert = companiesData.map(c => ({
        name: c.name,
        commercial_website: c.commercialWebsite,
        broker_access: c.brokerAccess,
        commercial_manager: c.commercialManager,
        manager_email: c.managerEmail,
        is_featured: c.isFeatured,
      }));

      const { data, error } = await supabase
        .from("companies")
        .insert(dataToInsert)
        .select();

      if (error) {
        console.error("Error bulk creating companies:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Éxito",
        description: `${data.length} compañías importadas correctamente.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error en la importación",
        description: "No se pudieron importar las compañías. Revisa la consola para más detalles.",
        variant: "destructive",
      });
      console.error("Error bulk creating companies:", error);
    },
  });

  return {
    companies,
    isLoading,
    error,
    createCompany: createCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    isCreating: createCompanyMutation.isPending,
    isUpdating: updateCompanyMutation.isPending,
    isDeleting: deleteCompanyMutation.isPending,
    bulkCreateCompanies: bulkCreateCompaniesMutation.mutateAsync,
    isBulkCreating: bulkCreateCompaniesMutation.isPending,
  };
};
