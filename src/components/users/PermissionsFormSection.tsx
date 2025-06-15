
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Permissions = Record<string, {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}>;

interface PermissionsFormSectionProps {
  permissions: Permissions;
  onPermissionsChange: (permissions: Permissions) => void;
  disabled?: boolean;
}

export const sections = [
  { key: 'users', label: 'Usuarios' },
  { key: 'delegations', label: 'Delegaciones' },
  { key: 'companies', label: 'Compañías' },
  { key: 'products', label: 'Productos' },
  { key: 'department_content', label: 'Contenido por Departamento' },
  { key: 'news', label: 'Noticias' },
];

export const PermissionsFormSection = ({ permissions, onPermissionsChange, disabled = false }: PermissionsFormSectionProps) => {

  const updatePermission = (section: string, permission: string, value: boolean) => {
    onPermissionsChange({
      ...permissions,
      [section]: {
        ...permissions[section],
        [permission]: value,
      },
    });
  };

  return (
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled}
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
  );
};
