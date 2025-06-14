
import { useState, lazy, Suspense } from "react";
import { useUsers } from "@/hooks/useUsers";
import { User as UserType } from "@/types";
import { UserListPage } from "@/components/users/UserListPage";

const CreateUserPage = lazy(() => import('@/components/users/CreateUserPage').then(m => ({ default: m.CreateUserPage })));
const EditUserPage = lazy(() => import('@/components/users/EditUserPage').then(m => ({ default: m.EditUserPage })));
const UserDetailPage = lazy(() => import('@/components/users/UserDetailPage').then(m => ({ default: m.UserDetailPage })));


type PageMode = 'list' | 'create' | 'detail' | 'edit';

const Users = () => {
  const { users, delegations, loading, createUser, updateUser, deleteUser } = useUsers();
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

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

  const handleBulkDelete = async (userIds: string[]) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${userIds.length} usuarios?`)) {
      await Promise.all(userIds.map(id => deleteUser(id)));
    }
  };

  const SuspenseFallback = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando vista...</p>
      </div>
    </div>
  );

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

  const pageContent = () => {
    if (pageMode === 'create') {
      return (
        <CreateUserPage
          delegations={delegations}
          onSubmit={handleCreateUser}
          onCancel={() => setPageMode('list')}
        />
      );
    }
  
    if (pageMode === 'edit' && selectedUser) {
      return (
        <EditUserPage
          user={selectedUser}
          delegations={delegations}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setPageMode('list');
            setSelectedUser(null);
          }}
        />
      );
    }
  
    if (pageMode === 'detail' && selectedUser) {
      return (
        <UserDetailPage
          user={selectedUser}
          delegations={delegations}
          onBack={() => setPageMode('list')}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      );
    }
  
    return (
      <UserListPage
        users={users}
        delegations={delegations}
        loading={loading}
        onSetPageMode={() => setPageMode('create')}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onBulkDelete={handleBulkDelete}
      />
    );
  };

  return (
    <Suspense fallback={<SuspenseFallback />}>
      {pageContent()}
    </Suspense>
  );
};

export default Users;
