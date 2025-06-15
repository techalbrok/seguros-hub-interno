
import { CardTitle, CardHeader } from "@/components/ui/card";
import { AvatarUpload } from "@/components/AvatarUpload";
import { User as UserType } from "@/types";

interface BrokerageConfig {
  name: string;
  logo_url?: string;
}

interface UserProfileHeaderProps {
  brokerageConfig: BrokerageConfig | null;
  userProfile: UserType;
  onAvatarUpload: (url: string) => void;
}

export const UserProfileHeader = ({ brokerageConfig, userProfile, onAvatarUpload }: UserProfileHeaderProps) => {
  return (
    <CardHeader>
      {brokerageConfig && (
        <div className="flex items-center gap-3 mb-4 border-b pb-4">
          {brokerageConfig.logo_url && (
            <img src={brokerageConfig.logo_url} alt={`Logo de ${brokerageConfig.name}`} className="h-10 w-auto object-contain" />
          )}
          <h2 className="text-xl font-semibold text-sidebar-primary dark:text-white">{brokerageConfig.name}</h2>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <AvatarUpload
          currentAvatarUrl={userProfile.avatarUrl}
          onUploadComplete={onAvatarUpload}
          name={userProfile.name}
        />
        <div>
          <CardTitle className="text-2xl text-sidebar-primary dark:text-white">
            Mi Perfil
          </CardTitle>
          <p className="text-muted-foreground">{userProfile.email}</p>
        </div>
      </div>
    </CardHeader>
  );
};
