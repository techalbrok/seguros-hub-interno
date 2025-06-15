import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delegation } from "@/types";
import { MapPin, Phone, Mail, Globe, User, Building } from "lucide-react";
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";

interface DelegationDetailProps {
  delegation: Delegation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

export const DelegationDetail = ({ delegation, open, onOpenChange, onEdit }: DelegationDetailProps) => {
  if (!delegation) return null;
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>{delegation.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">INFORMACIÓN BÁSICA</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Nombre</p>
                    <p className="text-sidebar-primary dark:text-white">{delegation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Razón Social</p>
                    <p className="text-sidebar-primary dark:text-white">{delegation.legalName}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">CONTACTO</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{delegation.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{delegation.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{delegation.email}</span>
                  </div>
                  {delegation.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={delegation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {delegation.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">UBICACIÓN</h3>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{delegation.address}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">FECHAS</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Creada</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(delegation.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Actualizada</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(delegation.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {onEdit && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button onClick={onEdit}>
                Editar {t.singular}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
