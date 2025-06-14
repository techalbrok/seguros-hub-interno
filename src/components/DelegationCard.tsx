
import { Delegation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Mail, Globe, User, Edit, Trash2, Eye } from "lucide-react";

interface DelegationCardProps {
  delegation: Delegation;
  onEdit: (delegation: Delegation) => void;
  onDelete: (delegationId: string) => void;
  onView: (delegation: Delegation) => void;
}

export const DelegationCard = ({ delegation, onEdit, onDelete, onView }: DelegationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sidebar-primary dark:text-white truncate">
              {delegation.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {delegation.legalName}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{delegation.contactPerson}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{delegation.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{delegation.email}</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm line-clamp-2">{delegation.address}</span>
          </div>

          {delegation.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={delegation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                Web
              </a>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onView(delegation)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(delegation)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(delegation.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
