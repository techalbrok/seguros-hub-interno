
import { Users as UsersIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersStats } from "./UsersStats";
import { UsersListView } from "./UsersListView";
import { User, Delegation } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface UserListPageProps {
  users: User[];
  delegations: Delegation[];
  loading: boolean;
  onSetPageMode: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onBulkDelete: (userIds: string[]) => void;
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
}: UserListPageProps) => {
  const { isAdmin } = useAuth();

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
        {isAdmin && (
          <Button className="corporate-button" onClick={onSetPageMode}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
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
    </div>
  );
};
