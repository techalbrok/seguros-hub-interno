
import { User } from "lucide-react";
import { UserProfile } from "@/components/UserProfile";

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
          <User className="h-8 w-8" />
          Mi Perfil
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>
      <UserProfile />
    </div>
  );
};

export default Profile;
