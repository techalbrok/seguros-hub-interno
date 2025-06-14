
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Delegation } from "@/types";

interface UserFormProps {
  delegations: Delegation[];
  onSubmit: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    delegationId?: string;
    permissions: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;
  }) => Promise<boolean>;
  onCancel: () => void;
}

const sections = [
  { key: 'users', label: 'Usuarios' },
  { key: 'delegations', label: 'Delegaciones' },
  { key: 'companies', label: 'Compañías' },
  { key: 'products', label: 'Productos' },
  { key: 'department_content', label: 'Contenido por Departamento' },
  { key: 'news', label: 'Noticias' },
];

export const UserForm = ({ delegations, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    delegationId: '',
  });

  const [permissions, setPermissions] = useState<Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>>(() => {
    const initial: Record<string, any> = {};
    sections.forEach(section => {
      initial[section.key] = {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
      };
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onSubmit({
      ...formData,
      delegationId: formData.delegationId || undefined,
      permissions,
    });

    if (success) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        delegationId: '',
      });
      setPermissions(() => {
        const initial: Record<string, any> = {};
        sections.forEach(section => {
          initial[section.key] = {
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canView: true,
          };
        });
        return initial;
      });
    }

    setLoading(false);
  };

  const handleRoleChange = (role: 'admin' | 'user') => {
    setFormData({ ...formData, role });
    
    // Si es admin, dar todos los permisos
    if (role === 'admin') {
      const adminPermissions: Record<string, any> = {};
      sections.forEach(section => {
        adminPermissions[section.key] = {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true,
        };
      });
      setPermissions(adminPermissions);
    }
  };

  const updatePermission = (section: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [permission]: value,
      },
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-sidebar-primary dark:text-white">
          Crear Nuevo Usuario
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="delegation">Delegación (Opcional)</Label>
              <Select value={formData.delegationId} onValueChange={(value) => setFormData({ ...formData, delegationId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar delegación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin delegación</SelectItem>
                  {delegations.map((delegation) => (
                    <SelectItem key={delegation.id} value={delegation.id}>
                      {delegation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sidebar-primary dark:text-white">
              Permisos por Sección
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {sections.map((section) => (
                <Card key={section.key} className="p-4">
                  <h4 className="font-medium mb-3 text-sidebar-primary dark:text-white">
                    {section.label}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section.key}-view`}
                        checked={permissions[section.key]?.canView || false}
                        onCheckedChange={(checked) => updatePermission(section.key, 'canView', checked as boolean)}
                      />
                      <Label htmlFor={`${section.key}-view`} className="text-sm">
                        Ver
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section.key}-create`}
                        checked={permissions[section.key]?.canCreate || false}
                        onCheckedChange={(checked) => updatePermission(section.key, 'canCreate', checked as boolean)}
                      />
                      <Label htmlFor={`${section.key}-create`} className="text-sm">
                        Crear
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section.key}-edit`}
                        checked={permissions[section.key]?.canEdit || false}
                        onCheckedChange={(checked) => updatePermission(section.key, 'canEdit', checked as boolean)}
                      />
                      <Label htmlFor={`${section.key}-edit`} className="text-sm">
                        Editar
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section.key}-delete`}
                        checked={permissions[section.key]?.canDelete || false}
                        onCheckedChange={(checked) => updatePermission(section.key, 'canDelete', checked as boolean)}
                      />
                      <Label htmlFor={`${section.key}-delete`} className="text-sm">
                        Eliminar
                      </Label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading} className="corporate-button">
              {loading ? 'Creando...' : 'Crear Usuario'}
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
