
import { lazy, Suspense } from "react";
import { UserListPage } from "@/components/users/UserListPage";
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
import { useUserPage } from "@/hooks/users/useUserPage";

const CreateUserPage = lazy(() => import('@/components/users/CreateUserPage').then(m => ({ default: m.CreateUserPage })));
const EditUserPage = lazy(() => import('@/components/users/EditUserPage').then(m => ({ default: m.EditUserPage })));
const UserDetailPage = lazy(() => import('@/components/users/UserDetailPage').then(m => ({ default: m.UserDetailPage })));

const Users = () => {
  const {
    users,
    delegations,
    loading,
    pageMode,
    setPageMode,
    selectedUser,
    isConfirmDeleteDialogOpen,
    setIsConfirmDeleteDialogOpen,
    deleteTarget,
    setDeleteTarget,
    canEditUsers,
    canDeleteUsers,
    handleCreateUser,
    handleBulkCreateUsers,
    handleEditUser,
    handleUpdateUser,
    handleViewUser,
    handleDeleteRequest,
    handleBulkDeleteRequest,
    handleConfirmDelete,
    onCancelEdit,
    onCancelCreate,
    onBackFromDetail
  } = useUserPage();


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
          onCancel={onCancelCreate}
        />
      );
    }
  
    if (pageMode === 'edit' && selectedUser) {
      return (
        <EditUserPage
          user={selectedUser}
          delegations={delegations}
          onSubmit={handleUpdateUser}
          onCancel={onCancelEdit}
        />
      );
    }
  
    if (pageMode === 'detail' && selectedUser) {
      return (
        <UserDetailPage
          user={selectedUser}
          delegations={delegations}
          onBack={onBackFromDetail}
          onEdit={canEditUsers ? handleEditUser : undefined}
          onDelete={canDeleteUsers ? handleDeleteRequest : undefined}
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
        onEditUser={canEditUsers ? handleEditUser : undefined}
        onDeleteUser={canDeleteUsers ? handleDeleteRequest : undefined}
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
