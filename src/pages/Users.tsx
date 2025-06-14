
import { useState } from "react";
import { Users as UsersIcon, User, Grid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserForm } from "@/components/UserForm";
import { UserEditForm } from "@/components/UserEditForm";
import { UserCard } from "@/components/UserCard";
import { UserDetail } from "@/components/UserDetail";
import { useUsers } from "@/hooks/useUsers";
import { User as UserType } from "@/types";

type ViewMode = 'list' | 'grid' | 'table';
type PageMode = 'list' | 'create' | 'detail' | 'edit';

const Users = () => {
  const { users, delegations, loading, createUser, updateUser, deleteUser } = useUsers();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData);
    if (success) {
      setPageMode('list');
    }
    return success;
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setPageMode('edit');
  };

  const handleUpdateUser = async (userData: {
    name: string;
    role: 'admin' | 'user';
    delegationId?: string;
    permissions: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canView: boolean; }>;
  }) => {
    if (!selectedUser) return false;
    
    const success = await updateUser(selectedUser.id, {
      name: userData.name,
      role: userData.role,
      delegationId: userData.delegationId,
    });
    
    if (success) {
      setPageMode('list');
      setSelectedUser(null);
    }
    return success;
  };

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setPageMode('detail');
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      await deleteUser(userId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (pageMode === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
              <UsersIcon className="h-8 w-8" />
              Crear Usuario
            </h1>
            <p className="text-muted-foreground mt-2">
              Añade un nuevo usuario al sistema
            </p>
          </div>
        </div>
        <UserForm
          delegations={delegations}
          onSubmit={handleCreateUser}
          onCancel={() => setPageMode('list')}
        />
      </div>
    );
  }

  if (pageMode === 'edit' && selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
              <UsersIcon className="h-8 w-8" />
              Editar Usuario
            </h1>
            <p className="text-muted-foreground mt-2">
              Modifica la información del usuario
            </p>
          </div>
        </div>
        <UserEditForm
          user={selectedUser}
          delegations={delegations}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setPageMode('list');
            setSelectedUser(null);
          }}
        />
      </div>
    );
  }

  if (pageMode === 'detail' && selectedUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Detalle de Usuario
          </h1>
          <p className="text-muted-foreground mt-2">
            Información completa del usuario
          </p>
        </div>
        <UserDetail
          user={selectedUser}
          delegations={delegations}
          onBack={() => setPageMode('list')}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    );
  }

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
        <Button className="corporate-button" onClick={() => setPageMode('create')}>
          <Plus className="h-4 w-4 mr-2" />
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
              {users.filter(u => u.role === 'admin').length} administradores
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sidebar-primary dark:text-white">
              Lista de Usuarios
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <div className="flex items-center space-x-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Delegación</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
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
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  delegations={delegations}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
