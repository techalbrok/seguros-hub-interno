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
        const userPermissions = permissions?.filter(perm => perm.user_id === profile.id);
        
        // Calculate combined permissions by checking if ANY permission section allows the action
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
      console.log('Users fetched successfully:', combinedUsers);
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

      setDelegations(delegationsData);
      console.log('Delegations fetched successfully:', delegationsData);
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
      console.log('Creating user with edge function:', userData);
      
      // Get current session for authorization
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Usuario no autenticado');
      }

      // Call the edge function to create user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          delegationId: userData.delegationId,
          permissions: userData.permissions,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error calling create-user function:', error);
        throw error;
      }

      if (data.error) {
        console.error('Error from create-user function:', data.error);
        throw new Error(data.error);
      }

      console.log('User created successfully:', data);

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
        description: error instanceof Error ? error.message : "No se pudo crear el usuario",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      console.log('Updating user:', userId, updates);
      
      // Update profile
      const profileUpdates: any = {};
      if (updates.name !== undefined) profileUpdates.name = updates.name;
      if (updates.delegationId !== undefined) profileUpdates.delegation_id = updates.delegationId;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }
      }

      // Update role if changed
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: updates.role })
          .eq('user_id', userId);

        if (roleError) {
          console.error('Error updating role:', roleError);
          throw roleError;
        }
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
      console.log('Deleting user:', userId);
      
      // Delete user permissions first
      const { error: permissionsError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (permissionsError) {
        console.error('Error deleting user permissions:', permissionsError);
        throw permissionsError;
      }

      // Delete user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) {
        console.error('Error deleting user role:', roleError);
        throw roleError;
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

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
        description: "No se pudo eliminar el usuario. Solo se pueden eliminar datos de perfil, no la cuenta de autenticación.",
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
