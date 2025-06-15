
import { Delegation } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Phone, Mail, Globe, User, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // importamos el hook

interface DelegationCardProps {
  delegation: Delegation;
  onEdit: (delegation: Delegation) => void;
  onDelete: (delegationId: string) => void;
  onView: (delegation: Delegation) => void;
}

export const DelegationCard = ({ delegation, onEdit, onDelete, onView }: DelegationCardProps) => {
  const { isAdmin } = useAuth(); // obtenemos el flag de admin

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors truncate">
              {delegation.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {delegation.legalName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="truncate">{delegation.contactPerson}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{delegation.phone}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="text-sm truncate">{delegation.email}</span>
        </div>
        
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="line-clamp-2">{delegation.address}</span>
        </div>

        {delegation.website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={delegation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                Sitio web
              </a>
            </div>
          )}
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(delegation)}
            className="flex-1 min-w-[80px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(delegation)}
                className="flex-1 min-w-[80px]"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="destructive-outline"
                size="sm"
                onClick={() => onDelete(delegation.id)}
                className="flex-1 min-w-[80px]"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
