
import { Users as UsersIcon } from "lucide-react";
import { UserForm } from "@/components/UserForm";
import { Delegation } from "@/types";

interface CreateUserPageProps {
  delegations: Delegation[];
  onSubmit: (userData: any) => Promise<boolean>;
  onCancel: () => void;
}

export const CreateUserPage = ({ delegations, onSubmit, onCancel }: CreateUserPageProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Crear Usuario
          </h1>
          <p className="text-muted-foreground mt-2">
            Añade un nuevo usuario al sistema
          </p>
        </div>
        <UserForm
          delegations={delegations}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
