
import { Users as UsersIcon } from "lucide-react";
import { UserEditForm } from "@/components/UserEditForm";
import { User, Delegation } from "@/types";

interface EditUserPageProps {
  user: User;
  delegations: Delegation[];
  onSubmit: (userData: any) => Promise<boolean>;
  onCancel: () => void;
}

export const EditUserPage = ({ user, delegations, onSubmit, onCancel }: EditUserPageProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Editar Usuario
          </h1>
          <p className="text-muted-foreground mt-2">
            Modifica la información del usuario
          </p>
        </div>
        <UserEditForm
          user={user}
          delegations={delegations}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
