
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Profile, UserRole, UserPermission, Delegation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
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

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch user permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combine data
      const combinedUsers: User[] = profiles?.map((profile: any) => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        const userPermissions = permissions?.filter(perm => perm.user_id === profile.id);
        
        // Calculate combined permissions
        const combinedPermissions = {
          canCreate: userPermissions?.some(p => p.can_create) || false,
          canEdit: userPermissions?.some(p => p.can_edit) || false,
          canDelete: userPermissions?.some(p => p.can_delete) || false,
          canView: userPermissions?.some(p => p.can_view) || true,
        };

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: userRole?.role || 'user',
          delegationId: profile.delegation_id,
          permissions: combinedPermissions,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
        };
      }) || [];

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDelegations = async () => {
    try {
      const { data, error } = await supabase
        .from('delegations')
        .select('*')
        .order('name');

      if (error) throw error;

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

      setDelegations(delegationsData);
    } catch (error) {
      console.error('Error fetching delegations:', error);
    }
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    delegationId?: string;
    permissions: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;
  }) => {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // Update profile with delegation
      if (userData.delegationId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ delegation_id: userData.delegationId })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: userData.role,
        });

      if (roleError) throw roleError;

      // Create user permissions
      const permissionsToInsert = Object.entries(userData.permissions).map(([section, perms]) => ({
        user_id: authData.user.id,
        section,
        can_create: perms.canCreate,
        can_edit: perms.canEdit,
        can_delete: perms.canDelete,
        can_view: perms.canView,
      }));

      const { error: permissionsError } = await supabase
        .from('user_permissions')
        .insert(permissionsToInsert);

      if (permissionsError) throw permissionsError;

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      });

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          delegation_id: updates.delegationId,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update role if changed
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: updates.role })
          .eq('user_id', userId);

        if (roleError) throw roleError;
      }

      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados",
      });

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete from auth (this will cascade to profiles, roles, and permissions)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDelegations();
  }, []);

  return {
    users,
    delegations,
    loading,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
};
