
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CompanySpecification } from "@/types";

interface CreateSpecData {
  company_id: string;
  category: string;
  content: string;
  order_position?: number;
}

interface UpdateSpecData {
  id: string;
  category?: string;
  content?: string;
  order_position?: number;
}

export const useCompanySpecifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSpecificationMutation = useMutation({
    mutationFn: async (specData: CreateSpecData) => {
      const { data, error } = await supabase
        .from("company_specifications")
        .insert(specData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Especificación creada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la especificación.",
        variant: "destructive",
      });
      console.error("Error creating specification:", error);
    },
  });

  const updateSpecificationMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateSpecData) => {
      const { data, error } = await supabase
        .from("company_specifications")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Especificación actualizada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la especificación.",
        variant: "destructive",
      });
      console.error("Error updating specification:", error);
    },
  });

  const deleteSpecificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("company_specifications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Éxito", description: "Especificación eliminada." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la especificación.",
        variant: "destructive",
      });
      console.error("Error deleting specification:", error);
    },
  });

  return {
    createSpecification: createSpecificationMutation.mutate,
    updateSpecification: updateSpecificationMutation.mutate,
    deleteSpecification: deleteSpecificationMutation.mutate,
    isCreating: createSpecificationMutation.isPending,
    isUpdating: updateSpecificationMutation.isPending,
    isDeleting: deleteSpecificationMutation.isPending,
  };
};
