
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Delegation } from '@/types';

const fetchDelegations = async (): Promise<Delegation[]> => {
  console.log("Fetching delegations...");
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated');
    return [];
  }

  const { data, error } = await supabase
    .from('delegations')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching delegations:', error);
    throw error;
  }

  const delegationsData: Delegation[] = data?.map((delegation: any) => ({
    id: delegation.id,
    name: delegation.name,
    legalName: delegation.legal_name,
    address: delegation.address,
    phone: delegation.phone,
    email: delegation.email,
    website: delegation.website,
    contactPerson: delegation.contact_person,
    userId: delegation.user_id,
    createdAt: new Date(delegation.created_at),
    updatedAt: new Date(delegation.updated_at),
  })) || [];

  console.log('Delegations fetched successfully:', delegationsData);
  return delegationsData;
};

export const useDelegationsQuery = () => {
  return useQuery({
    queryKey: ["delegations"],
    queryFn: fetchDelegations,
    initialData: [],
  });
};
