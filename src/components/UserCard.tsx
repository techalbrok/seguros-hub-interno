
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Edit, Trash2, Eye } from 'lucide-react';
import { User as UserType, Delegation } from '@/types';

interface UserCardProps {
  user: UserType;
  delegations: Delegation[];
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
  onView: (user: UserType) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  delegations,
  onEdit,
  onDelete,
  onView
}) => {
  const delegation = delegations.find(d => d.id === user.delegationId);

  const formatDate = (date: Date) => {
    try {
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
          <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
            {user.role === 'admin' ? "Administrador" : "Usuario"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{user.email}</span>
          </div>
          {delegation && (
            <div className="flex items-center space-x-2 text-sm">
              <Building className="w-4 h-4 text-gray-500" />
              <span>{delegation.name}</span>
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rol: {user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Creado: {formatDate(user.createdAt)}
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
