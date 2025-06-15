
import { useState } from "react";
import { User as UserType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { CreateUserData } from "@/hooks/users";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";

export type PageMode = 'list' | 'create' | 'detail' | 'edit';

export const useUserPage = () => {
  const { users, delegations, loading, createUser, updateUser, deleteUser } = useUsers();
  const { permissions } = useAuth();
  const { toast } = useToast();

  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  const canEditUsers = permissions?.users?.canEdit ?? false;
  const canDeleteUsers = permissions?.users?.canDelete ?? false;

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
      permissions: userData.permissions,
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

  const onCancelEdit = () => {
    setPageMode('list');
    setSelectedUser(null);
  };

  const onCancelCreate = () => {
    setPageMode('list');
  };

  const onBackFromDetail = () => {
    setPageMode('list');
  };

  return {
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
  };
};
