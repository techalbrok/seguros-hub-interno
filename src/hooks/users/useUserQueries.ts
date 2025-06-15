
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { User, Delegation } from '@/types';
import { sections } from '@/components/users/PermissionsFormSection';

export const useUserQueries = () => {
  const {
    data: users = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users...");
      
      // Fetch profiles with delegations
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          delegations:delegation_id (
            id,
            name
          )
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        throw rolesError;
      }

      // Fetch user permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
      }

      // Combine data
      const combinedUsers: User[] = profiles?.map((profile: any) => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        const userPermissionsList = permissions?.filter(perm => perm.user_id === profile.id);
        
        const detailedPermissions: User['permissions'] = {};

        if (userRole?.role === 'admin') {
          sections.forEach(section => {
            detailedPermissions[section.key] = {
              canCreate: true,
              canEdit: true,
              canDelete: true,
              canView: true,
            };
          });
        } else {
          sections.forEach(section => {
            const dbPerm = userPermissionsList?.find(p => p.section === section.key);
            detailedPermissions[section.key] = {
              canCreate: dbPerm?.can_create || false,
              canEdit: dbPerm?.can_edit || false,
              canDelete: dbPerm?.can_delete || false,
              canView: dbPerm?.can_view !== false, // Default to true unless explicitly false
            };
          });
        }

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: userRole?.role || 'user',
          delegationId: profile.delegation_id,
          avatarUrl: profile.avatar_url,
          permissions: detailedPermissions,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
        };
      }) || [];

      console.log('Users fetched successfully:', combinedUsers);
      return combinedUsers;
    },
  });

  const {
    data: delegations = [],
  } = useQuery({
    queryKey: ["delegations-for-users"],
    queryFn: async () => {
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
    },
  });

  return {
    users,
    delegations,
    loading,
    error,
  };
};
