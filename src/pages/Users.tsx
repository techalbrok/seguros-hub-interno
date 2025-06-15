import { useState, lazy, Suspense } from "react";
import { useUsers } from "@/hooks/useUsers";
import { User as UserType, Delegation } from "@/types";
import { UserListPage } from "@/components/users/UserListPage";
import { useToast } from "@/components/ui/use-toast";
import { CreateUserData } from "@/hooks/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

const CreateUserPage = lazy(() => import('@/components/users/CreateUserPage').then(m => ({ default: m.CreateUserPage })));
const EditUserPage = lazy(() => import('@/components/users/EditUserPage').then(m => ({ default: m.EditUserPage })));
const UserDetailPage = lazy(() => import('@/components/users/UserDetailPage').then(m => ({ default: m.UserDetailPage })));

type PageMode = 'list' | 'create' | 'detail' | 'edit';

const Users = () => {
  const { users, delegations, loading, createUser, updateUser, deleteUser } = useUsers();
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const { toast } = useToast();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  const handleCreateUser = async (userData: CreateUserData) => {
    const success = await createUser(userData);
    if (success) {
      setPageMode('list');
    }
    return success;
  };
  
  const handleBulkCreateUsers = async (usersData: CreateUserData[]) => {
    const results = await Promise.allSettled(usersData.map(userData => createUser(userData)));
  
    const successfulCreations = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failedCreations = results.length - successfulCreations;
  
    toast({
      title: "Importación completada",
      description: `${successfulCreations} de ${usersData.length} usuarios creados exitosamente. ${failedCreations > 0 ? `Fallaron ${failedCreations}.` : ''}`,
      variant: failedCreations > 0 ? 'destructive' : 'default'
    });
  
    return { successfulCreations, failedCreations };
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

  const handleDeleteRequest = (userId: string) => {
    setDeleteTarget(userId);
    setIsConfirmDeleteDialogOpen(true);
  };
  
  const handleBulkDeleteRequest = (userIds: string[]) => {
    setDeleteTarget(userIds);
    setIsConfirmDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
  
    if (Array.isArray(deleteTarget)) {
      await Promise.all(deleteTarget.map(id => deleteUser(id)));
      toast({
        title: 'Usuarios eliminados',
        description: `${deleteTarget.length} usuarios eliminados con éxito.`
      });
    } else {
      await deleteUser(deleteTarget);
      // Toast for single user deletion is handled in useUsers hook
    }
  
    setDeleteTarget(null);
    setIsConfirmDeleteDialogOpen(false);
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
          onDelete={handleDeleteRequest}
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
        onDeleteUser={handleDeleteRequest}
        onBulkDelete={handleBulkDeleteRequest}
        onBulkCreate={handleBulkCreateUsers}
      />
    );
  };

  return (
    <>
      <Suspense fallback={<SuspenseFallback />}>
        {pageContent()}
      </Suspense>
      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Esta acción no se puede deshacer. Esto eliminará permanentemente ${
                Array.isArray(deleteTarget)
                  ? `a ${deleteTarget.length} usuarios`
                  : 'al usuario'
              }.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleConfirmDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Users;
