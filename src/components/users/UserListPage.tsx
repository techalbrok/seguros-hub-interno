import { useState } from 'react';
import { Users as UsersIcon, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersStats } from "./UsersStats";
import { UsersListView } from "./UsersListView";
import { User, Delegation } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { UserImportDialog } from './UserImportDialog';
import { CreateUserData } from '@/hooks/users/types';
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
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
  onBulkCreate
}: UserListPageProps) => {
  const {
    permissions
  } = useAuth();
  const {
    config: brokerageConfig
  } = useBrokerageConfig();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const canCreateUsers = permissions?.users?.canCreate ?? false;
  const canEditUsers = permissions?.users?.canEdit ?? false;
  const canDeleteUsers = permissions?.users?.canDelete ?? false;
  const userTerminology = brokerageConfig?.terminology?.user || {
    singular: "Usuario",
    plural: "Usuarios"
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {brokerageConfig && brokerageConfig.logo_url && <div className="flex items-center gap-3 mb-2">
              
              <h2 className="text-lg font-semibold text-sidebar-primary dark:text-white">{brokerageConfig.name}</h2>
            </div>}
          <h1 className="text-2xl sm:text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            Gestión de {userTerminology.plural}
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra {userTerminology.plural.toLowerCase()}, roles y permisos del sistema
          </p>
        </div>
        {canCreateUsers && <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
            <Button onClick={onSetPageMode}>
              <Plus className="h-4 w-4 mr-2" />
              Crear {userTerminology.singular}
            </Button>
          </div>}
      </div>

      <UsersStats users={users} />

      <UsersListView users={users} delegations={delegations} loading={loading} onViewUser={onViewUser} onEditUser={canEditUsers ? onEditUser : undefined} onDeleteUser={canDeleteUsers ? onDeleteUser : undefined} onBulkDelete={canDeleteUsers ? onBulkDelete : undefined} />

      <UserImportDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} onBulkCreate={onBulkCreate} delegations={delegations} />
    </div>;
};