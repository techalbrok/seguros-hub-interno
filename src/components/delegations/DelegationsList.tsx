
import { Delegation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, Phone, Mail, Eye, Edit, Trash2 } from "lucide-react";

interface DelegationsListProps {
  delegations: Delegation[];
  onEdit: (delegation: Delegation) => void;
  onDelete: (delegationId: string) => void;
  onView: (delegation: Delegation) => void;
}

export const DelegationsList = ({ delegations, onEdit, onDelete, onView }: DelegationsListProps) => (
  <div className="space-y-4">
    {delegations.map((delegation) => (
      <Card key={delegation.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sidebar-primary dark:text-white">
                  {delegation.name}
                </h3>
                <p className="text-sm text-muted-foreground">{delegation.legalName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{delegation.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{delegation.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{delegation.email}</span>
                  </div>
                </div>
              </div>
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
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
