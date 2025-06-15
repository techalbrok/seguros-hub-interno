
import { useState } from 'react';
import { Users as UsersIcon, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersStats } from "./UsersStats";
import { UsersListView } from "./UsersListView";
import { User, Delegation } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { UserImportDialog } from './UserImportDialog';
import { CreateUserData } from '@/hooks/users/types';

interface UserListPageProps {
  users: User[];
  delegations: Delegation[];
  loading: boolean;
  onSetPageMode: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onBulkDelete: (userIds: string[]) => void;
  onBulkCreate: (users: CreateUserData[]) => Promise<any>;
}

export const UserListPage = ({
  users,
  delegations,
  loading,
  onSetPageMode,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onBulkDelete,
  onBulkCreate,
}: UserListPageProps) => {
  const { isAdmin } = useAuth();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
            <Button variant="outline" className="corporate-button" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
            <Button className="corporate-button" onClick={onSetPageMode}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </div>
        )}
      </div>

      <UsersStats users={users} />

      <UsersListView
        users={users}
        delegations={delegations}
        loading={loading}
        onViewUser={onViewUser}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
        onBulkDelete={onBulkDelete}
      />

      <UserImportDialog 
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onBulkCreate={onBulkCreate}
        delegations={delegations}
      />
    </div>
  );
};
