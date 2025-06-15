
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Building } from "lucide-react";
import { Delegation } from "@/types";

interface DelegationInfoCardProps {
    delegation: Delegation;
}

export const DelegationInfoCard = ({ delegation }: DelegationInfoCardProps) => {
    return (
        <div>
            <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                Información de la Delegación
            </h3>
            <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre comercial</p>
                        <p className="font-medium">{delegation.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Persona de contacto</p>
                        <p className="font-medium">{delegation.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{delegation.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{delegation.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{delegation.address}</p>
                    </div>
                    {delegation.website && (
                      <div>
                        <p className="text-sm text-muted-foreground">Sitio web</p>
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
                </CardContent>
              </Card>
        </div>
    );
};
