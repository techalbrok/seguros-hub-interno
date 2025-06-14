
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
            <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                {user.role === 'admin' ? "Administrador" : "Usuario"}
            </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
            {user.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          {delegation && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>{delegation.name}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Creado: {formatDate(user.createdAt)}
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(user)}
            className="flex-1 min-w-[80px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="flex-1 min-w-[80px]"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="flex-1 min-w-[80px]"
          >
            <Trash2 className="w-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};
