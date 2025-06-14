
import { User, Delegation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface UserCardProps {
  user: User;
  delegations: Delegation[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onView: (user: User) => void;
}

export const UserCard = ({ user, delegations, onEdit, onDelete, onView }: UserCardProps) => {
  const delegation = delegations.find(d => d.id === user.delegationId);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sidebar-primary dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rol:</span>
            <Badge className={getRoleColor(user.role)}>
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Badge>
          </div>
          
          {delegation && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Delegación:</span>
              <span className="text-sm font-medium text-sidebar-primary dark:text-white">
                {delegation.name}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Permisos:</span>
            <div className="flex space-x-1">
              {user.permissions.canView && (
                <Badge variant="outline" className="text-xs">V</Badge>
              )}
              {user.permissions.canCreate && (
                <Badge variant="outline" className="text-xs">C</Badge>
              )}
              {user.permissions.canEdit && (
                <Badge variant="outline" className="text-xs">E</Badge>
              )}
              {user.permissions.canDelete && (
                <Badge variant="outline" className="text-xs">D</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(user)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(user.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
