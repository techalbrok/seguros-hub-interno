
import { useState } from "react";
import { Users as UsersIcon, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Users = () => {
  const [users] = useState([
    {
      id: "1",
      name: "María García",
      email: "maria.garcia@correduriaseguros.com",
      role: "admin" as const,
      delegationName: "Madrid Centro",
      permissions: { canCreate: true, canEdit: true, canDelete: true, canView: true },
      lastActive: "Hace 2 horas",
      status: "active"
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos.lopez@correduriaseguros.com",
      role: "user" as const,
      delegationName: "Barcelona",
      permissions: { canCreate: true, canEdit: true, canDelete: false, canView: true },
      lastActive: "Hace 1 día",
      status: "active"
    },
    {
      id: "3",
      name: "Ana Martín",
      email: "ana.martin@correduriaseguros.com",
      role: "user" as const,
      delegationName: "Valencia",
      permissions: { canCreate: false, canEdit: true, canDelete: false, canView: true },
      lastActive: "Hace 3 días",
      status: "inactive"
    },
    {
      id: "4",
      name: "José Ruiz",
      email: "jose.ruiz@correduriaseguros.com",
      role: "admin" as const,
      delegationName: "Sevilla",
      permissions: { canCreate: true, canEdit: true, canDelete: true, canView: true },
      lastActive: "Hace 5 horas",
      status: "active"
    }
  ]);

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Button className="corporate-button">
          <User className="h-4 w-4 mr-2" />
          Crear Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
              {users.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.filter(u => u.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Con permisos completos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuarios Estándar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
              {users.filter(u => u.role === 'user').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Con permisos limitados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sidebar-primary dark:text-white">
            Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Delegación</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
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
                    {user.delegationName}
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
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastActive}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
