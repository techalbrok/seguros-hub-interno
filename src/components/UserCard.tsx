
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Edit, Trash2, Eye } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    delegation?: string;
    active: boolean;
    last_login?: string;
  };
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  onView: (user: any) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </div>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{user.email}</span>
          </div>
          {user.delegation && (
            <div className="flex items-center space-x-2 text-sm">
              <Building className="w-4 h-4 text-gray-500" />
              <span>{user.delegation}</span>
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rol: {user.role}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Último acceso: {formatDate(user.last_login)}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(user)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
