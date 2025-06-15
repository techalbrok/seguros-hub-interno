
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DemoSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Configuración (Demo)
        </h1>
        <p className="text-muted-foreground mt-2">
          Esta es una vista previa de la página de configuración.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Opciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-8 text-center border rounded-lg bg-background">
                <p>Aquí se mostrarían las opciones de configuración de la demo.</p>
                <p className="text-sm text-muted-foreground mt-2">Actualmente, esta sección es solo una demostración visual.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoSettings;
