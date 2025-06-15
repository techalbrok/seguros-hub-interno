
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User as UserType, Delegation } from "@/types";
import { sections } from "@/components/users/PermissionsFormSection";

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [delegation, setDelegation] = useState<Delegation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) throw roleError;

      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id);

      if (permissionsError) throw permissionsError;

      const detailedPermissions: UserType['permissions'] = {};
      if (roleData.role === 'admin') {
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
          const dbPerm = permissions.find(p => p.section === section.key);
          detailedPermissions[section.key] = {
            canCreate: dbPerm?.can_create || false,
            canEdit: dbPerm?.can_edit || false,
            canDelete: dbPerm?.can_delete || false,
            canView: dbPerm?.can_view !== false,
          };
        });
      }

      const userProfileData: UserType = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        role: roleData.role,
        delegationId: profile.delegation_id,
        permissions: detailedPermissions,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      };

      setUserProfile(userProfileData);
      setFormData({ name: profile.name });

      if (profile.delegation_id) {
        const { data: delegationData, error: delegationError } = await supabase
          .from('delegations')
          .select('*')
          .eq('id', profile.delegation_id)
          .single();

        if (!delegationError && delegationData) {
          setDelegation({
            id: delegationData.id,
            name: delegationData.name,
            legalName: delegationData.legal_name,
            address: delegationData.address,
            phone: delegationData.phone,
            email: delegationData.email,
            contactPerson: delegationData.contact_person,
            website: delegationData.website,
            createdAt: new Date(delegationData.created_at),
            updatedAt: new Date(delegationData.updated_at),
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil de usuario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleAvatarUpload = async (url: string) => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      
      setUserProfile(prev => prev ? { ...prev, avatarUrl: url, updatedAt: new Date() } : null);

      toast({
        title: "Avatar actualizado",
        description: "Tu foto de perfil se ha actualizado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el avatar",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile(prev => prev ? { ...prev, name: formData.name, updatedAt: new Date() } : null);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return { userProfile, delegation, loading, saving, formData, setFormData, handleSave, handleAvatarUpload };
};
