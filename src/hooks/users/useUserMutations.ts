import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateUserData, UpdateUserData } from './types';

export const useUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      console.log('Creating user with edge function:', userData);
      
      // Get current session for authorization
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Error al verificar la sesión: ' + sessionError.message);
      }
      
      if (!session) {
        throw new Error('Debes iniciar sesión como administrador para crear nuevos usuarios');
      }

      // Check if current user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!userRole || userRole.role !== 'admin') {
        throw new Error('Solo los administradores pueden crear nuevos usuarios');
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

      if (data?.error) {
        console.error('Error from create-user function:', data.error);
        throw new Error(data.error);
      }

      console.log('User created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: UpdateUserData) => {
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

      // Update permissions if changed
      if (updates.permissions) {
        // Delete old permissions
        const { error: deleteError } = await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error deleting old permissions:', deleteError);
          throw deleteError;
        }

        // Insert new permissions
        const permissionsToInsert = Object.entries(updates.permissions).map(([section, perms]) => ({
          user_id: userId,
          section: section,
          can_create: perms.canCreate,
          can_edit: perms.canEdit,
          can_delete: perms.canDelete,
          can_view: perms.canView,
        }));

        if (permissionsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('user_permissions')
            .insert(permissionsToInsert);

          if (insertError) {
            console.error('Error inserting new permissions:', insertError);
            throw insertError;
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. Solo se pueden eliminar datos de perfil, no la cuenta de autenticación.",
        variant: "destructive",
      });
    },
  });

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};
