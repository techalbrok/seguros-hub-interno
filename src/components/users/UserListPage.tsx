
import { Users as UsersIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersStats } from "./UsersStats";
import { UsersListView } from "./UsersListView";
import { User, Delegation } from "@/types";

interface UserListPageProps {
  users: User[];
  delegations: Delegation[];
  onSetPageMode: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserListPage = ({
  users,
  delegations,
  onSetPageMode,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: UserListPageProps) => {
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
        <Button className="corporate-button" onClick={onSetPageMode}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Usuario
        </Button>
      </div>

      <UsersStats users={users} />

      <UsersListView
        users={users}
        delegations={delegations}
        onViewUser={onViewUser}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
};
