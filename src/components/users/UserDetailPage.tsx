
import { Users as UsersIcon } from "lucide-react";
import { UserDetail } from "@/components/UserDetail";
import { User, Delegation } from "@/types";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";

interface UserDetailPageProps {
  user: User;
  delegations: Delegation[];
  onBack: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserDetailPage = ({ user, delegations, onBack, onEdit, onDelete }: UserDetailPageProps) => {
  const { config: brokerageConfig } = useBrokerageConfig();
  const userTerminology = brokerageConfig?.terminology?.user || { singular: "Usuario", plural: "Usuarios" };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          {brokerageConfig && brokerageConfig.logo_url && (
            <div className="flex items-center gap-3 mb-2">
              <img src={brokerageConfig.logo_url} alt={`Logo de ${brokerageConfig.name}`} className="h-8 w-auto object-contain" />
              <h2 className="text-lg font-semibold text-sidebar-primary dark:text-white">{brokerageConfig.name}</h2>
            </div>
          )}
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <UsersIcon className="h-8 w-8" />
            Detalle de {userTerminology.singular}
          </h1>
          <p className="text-muted-foreground mt-2">
            Información completa del {userTerminology.singular.toLowerCase()}
          </p>
        </div>
        <UserDetail
          user={user}
          delegations={delegations}
          onBack={onBack}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
