
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Delegation } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface UsersTableProps {
  users: User[];
  delegations: Delegation[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getRoleColor = (role: string) => {
  return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
};

export const UsersTable = ({ users, delegations, onViewUser, onEditUser }: UsersTableProps) => {
  const { isAdmin } = useAuth();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Delegación</TableHead>
          <TableHead>Permisos</TableHead>
          {isAdmin && <TableHead>Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const delegation = delegations.find(d => d.id === user.delegationId);
          return (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sidebar-primary dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleColor(user.role)}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </Badge>
              </TableCell>
              <TableCell className="text-sidebar-primary dark:text-white">
                {delegation ? delegation.name : 'Sin asignar'}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  {user.permissions.canCreate && (
                    <Badge variant="outline" className="text-xs">C</Badge>
                  )}
                  {user.permissions.canEdit && (
                    <Badge variant="outline" className="text-xs">E</Badge>
                  )}
                  {user.permissions.canDelete && (
                    <Badge variant="outline" className="text-xs">D</Badge>
                  )}
                  {user.permissions.canView && (
                    <Badge variant="outline" className="text-xs">V</Badge>
                  )}
                </div>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewUser(user)}>
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEditUser(user)}>
                      Editar
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
