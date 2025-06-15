import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Delegation } from "@/types";
import { PermissionsFormSection, sections } from "./users/PermissionsFormSection";

interface UserEditFormProps {
  user: User;
  delegations: Delegation[];
  onSubmit: (userData: {
    name: string;
    role: 'admin' | 'user';
    delegationId?: string;
    permissions: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;
  }) => Promise<boolean>;
  onCancel: () => void;
}

export const UserEditForm = ({ user, delegations, onSubmit, onCancel }: UserEditFormProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role as 'admin' | 'user',
    delegationId: user.delegationId || 'none',
  });

  const [permissions, setPermissions] = useState<Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>>(user.permissions);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onSubmit({
      ...formData,
      delegationId: formData.delegationId === 'none' ? undefined : formData.delegationId,
      permissions,
    });

    setLoading(false);
    if (success) {
      onCancel();
    }
  };

  const handleRoleChange = (role: 'admin' | 'user') => {
    setFormData({ ...formData, role });
    
    const newPermissions: Record<string, any> = {};
    sections.forEach(section => {
      newPermissions[section.key] = {
        canCreate: role === 'admin',
        canEdit: role === 'admin',
        canDelete: role === 'admin',
        canView: true,
      };
    });
    setPermissions(newPermissions);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-sidebar-primary dark:text-white">
          Editar Usuario: {user.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-muted-foreground">
                El email no puede ser modificado
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delegation">Delegación</Label>
              <Select value={formData.delegationId} onValueChange={(value) => setFormData({ ...formData, delegationId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar delegación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin delegación</SelectItem>
                  {delegations.map((delegation) => (
                    <SelectItem key={delegation.id} value={delegation.id}>
                      {delegation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <PermissionsFormSection
            permissions={permissions}
            onPermissionsChange={setPermissions}
            disabled={formData.role === 'admin'}
          />

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading} className="corporate-button">
              {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
