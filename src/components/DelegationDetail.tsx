
import { Button } from "@/components/ui/button";
import { Delegation } from "@/types";
import { MapPin, Phone, Mail, Globe, User, Building, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DelegationDetailProps {
  delegation: Delegation;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const DelegationDetail = ({ delegation, onBack, onEdit, onDelete }: DelegationDetailProps) => {
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a {t.plural}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className="flex-grow">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Building className="h-7 w-7 text-primary" />
                {delegation.name}
              </CardTitle>
              <CardDescription className="mt-1 ml-10">{delegation.legalName}</CardDescription>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive-outline" size="sm" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-muted-foreground border-b pb-2">Información de Contacto</h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{delegation.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{delegation.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{delegation.email}</span>
                </div>
                {delegation.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={delegation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {delegation.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-semibold text-base text-muted-foreground border-b pb-2">Ubicación y Fechas</h3>
               <div className="space-y-3 pl-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <p className="font-medium">{delegation.address}</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Creada</p>
                  <p className="text-sm font-medium">
                    {formatDate(delegation.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última actualización</p>
                  <p className="text-sm font-medium">
                    {formatDate(delegation.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
