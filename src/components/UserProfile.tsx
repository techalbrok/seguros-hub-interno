
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as UserType, Delegation } from "@/types";

export const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [delegation, setDelegation] = useState<Delegation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) throw roleError;

      // Fetch user permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id);

      if (permissionsError) throw permissionsError;

      // Transform permissions to the expected format
      const permissionsMap = permissions.reduce((acc, perm) => {
        acc[perm.section] = {
          canCreate: perm.can_create,
          canEdit: perm.can_edit,
          canDelete: perm.can_delete,
          canView: perm.can_view,
        };
        return acc;
      }, {} as Record<string, any>);

      const userProfileData: UserType = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: roleData.role,
        delegationId: profile.delegation_id,
        permissions: {
          canCreate: roleData.role === 'admin',
          canEdit: roleData.role === 'admin',
          canDelete: roleData.role === 'admin',
          canView: true,
        },
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      };

      setUserProfile(userProfileData);
      setFormData({ name: profile.name });

      // Fetch delegation if exists
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
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil de usuario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

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

      setUserProfile({ ...userProfile, name: formData.name });
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se pudo cargar el perfil de usuario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-white text-lg">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl text-sidebar-primary dark:text-white">
                Mi Perfil
              </CardTitle>
              <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={userProfile.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-muted-foreground">
                      El email no puede ser modificado
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rol:</span>
                    <Badge className={getRoleColor(userProfile.role)}>
                      {userProfile.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                  Información del Sistema
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delegación:</span>
                    <span className="font-medium text-sidebar-primary dark:text-white">
                      {delegation ? delegation.name : 'Sin asignar'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Miembro desde:</span>
                    <span className="font-medium">
                      {formatDate(userProfile.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última actualización:</span>
                    <span className="font-medium">
                      {formatDate(userProfile.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {delegation && (
            <div>
              <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                Información de la Delegación
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre comercial</p>
                        <p className="font-medium">{delegation.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Persona de contacto</p>
                        <p className="font-medium">{delegation.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{delegation.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{delegation.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{delegation.address}</p>
                    </div>
                    {delegation.website && (
                      <div>
                        <p className="text-sm text-muted-foreground">Sitio web</p>
                        <a 
                          href={delegation.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {delegation.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button 
              onClick={handleSave} 
              disabled={saving || formData.name === userProfile.name}
              className="corporate-button"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
