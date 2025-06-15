
import { useState, useEffect } from "react";
import { CreateUserPage } from "@/components/users/CreateUserPage";
import { EditUserPage } from "@/components/users/EditUserPage";
import { UserDetailPage } from "@/components/users/UserDetailPage";
import { UsersStats } from "@/components/users/UsersStats";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users as UsersIcon } from "lucide-react";
import { useDemoAuth } from "./DemoAuthContext";
import { CreateUserData, UpdateUserData } from "@/hooks/useUsers";
import { Delegation } from "@/types";

// Tipos de datos para la demo, compatibles con los componentes reales
interface DemoUserType {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  delegationId?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: Record<string, {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
  }>;
}

const DEMO_USERS_KEY = "demo_users_list";
const DEMO_DELEGATIONS_KEY = "demo_delegations_list";

const adminPermissions = { users: { canCreate: true, canEdit: true, canDelete: true, canView: true }, delegations: { canCreate: true, canEdit: true, canDelete: true, canView: true }, companies: { canCreate: true, canEdit: true, canDelete: true, canView: true }, products: { canCreate: true, canEdit: true, canDelete: true, canView: true }, department_content: { canCreate: true, canEdit: true, canDelete: true, canView: true }, news: { canCreate: true, canEdit: true, canDelete: true, canView: true }, };
const userPermissions = { users: { canCreate: false, canEdit: false, canDelete: false, canView: true }, delegations: { canCreate: false, canEdit: false, canDelete: false, canView: true }, companies: { canCreate: false, canEdit: false, canDelete: false, canView: true }, products: { canCreate: false, canEdit: false, canDelete: false, canView: true }, department_content: { canCreate: false, canEdit: false, canDelete: false, canView: true }, news: { canCreate: false, canEdit: false, canDelete: false, canView: true }, };

const demoDefaultUsers: DemoUserType[] = [
  { id: "1", name: "Ana Demo", email: "ana@demo.com", role: "admin", createdAt: new Date(), updatedAt: new Date(), permissions: adminPermissions, delegationId: "1" },
  { id: "2", name: "Luis Demo", email: "luis@demo.com", role: "user", createdAt: new Date(), updatedAt: new Date(), permissions: userPermissions, delegationId: "2" },
];
const demoDefaultDelegations = [{ id: "1", name: "Central Demo" }, { id: "2", name: "Sucursal Norte Demo" }];

export const DemoUsers = () => {
  const { user: authUser } = useDemoAuth();
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [users, setUsers] = useState<DemoUserType[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [selectedUser, setSelectedUser] = useState<DemoUserType | null>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem(DEMO_USERS_KEY);
    const storedDelegations = localStorage.getItem(DEMO_DELEGATIONS_KEY);
    
    setUsers(storedUsers ? JSON.parse(storedUsers).map((u: any) => ({ ...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt || u.createdAt) })) : demoDefaultUsers);
    setDelegations(storedDelegations ? JSON.parse(storedDelegations) : demoDefaultDelegations);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  }, [users]);
  
  const isAdmin = authUser?.role === 'admin';

  const handleCreateSubmit = async (userData: CreateUserData) => {
    const newUser: DemoUserType = {
      ...userData,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      updatedAt: new Date(),
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.name}`,
    };
    setUsers(u => [...u, newUser]);
    setMode('list');
    return true;
  };
  
  const handleUpdateSubmit = async (userData: UpdateUserData) => {
    setUsers(users => users.map(u => u.id === userData.userId ? { ...u, ...userData.updates, updatedAt: new Date() } : u));
    setMode('list');
    setSelectedUser(null);
    return true;
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar a este usuario?")) {
        setUsers(u => u.filter(user => user.id !== userId));
        setMode('list');
    }
  };
  
  if (mode === 'create') {
    return <CreateUserPage delegations={delegations} onSubmit={handleCreateSubmit} onCancel={() => setMode('list')} />;
  }
  
  if (mode === 'edit' && selectedUser) {
    return <EditUserPage user={selectedUser} delegations={delegations} onSubmit={handleUpdateSubmit} onCancel={() => setMode('list')} />;
  }
  
  if (mode === 'view' && selectedUser) {
    return <UserDetailPage user={selectedUser} delegations={delegations} onBack={() => setMode('list')} onEdit={(user) => { setSelectedUser(user as DemoUserType); setMode('edit'); }} onDelete={handleDeleteUser} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            Gestión de Usuarios (Demo)
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra usuarios, roles y permisos de la demo
          </p>
        </div>
        {isAdmin && (
            <Button onClick={() => setMode('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
        )}
      </div>

      <UsersStats users={users} />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Delegación</TableHead>
              {isAdmin && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const delegation = delegations.find(d => d.id === user.delegationId);
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}<br/><span className="text-sm text-muted-foreground">{user.email}</span></TableCell>
                  <TableCell><Badge variant={user.role === 'admin' ? "default" : "secondary"}>{user.role}</Badge></TableCell>
                  <TableCell>{delegation?.name || 'N/A'}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setMode('view'); }}>Ver</Button>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setMode('edit'); }}>Editar</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
             {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} className="text-center h-24">
                    No hay usuarios demo.
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
