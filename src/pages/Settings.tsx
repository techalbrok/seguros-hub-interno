
import { Settings as SettingsIcon } from "lucide-react";
import { BrokerageSettings } from "@/components/BrokerageSettings";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Settings = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Configuración
        </h1>
        <p className="text-muted-foreground mt-2">
          Configuración general de la plataforma y personalización de la correduría
        </p>
      </div>
      <BrokerageSettings />
    </div>
  );
};

export default Settings;
