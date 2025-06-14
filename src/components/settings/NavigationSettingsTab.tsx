
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Users } from "lucide-react";

export const NavigationSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Accesos Directos del Menú Principal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
          <p className="text-muted-foreground">
            La gestión de accesos directos del menú principal estará disponible en una futura actualización.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
