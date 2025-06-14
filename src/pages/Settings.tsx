
import { Settings as SettingsIcon } from "lucide-react";
import { BrokerageSettings } from "@/components/BrokerageSettings";

const Settings = () => {
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
