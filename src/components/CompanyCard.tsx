
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe, Mail, User, Eye } from "lucide-react";
import type { Company } from "@/types";
import { useAuth } from "@/hooks/useAuth"; // ← Importamos useAuth

/**
 * Props for the CompanyCard component.
 */
interface CompanyCardProps {
  /** The company object containing details to display. */
  company: Company;
  /** Callback function to handle editing the company. */
  onEdit?: (company: Company) => void;
  /** Callback function to handle deleting the company. */
  onDelete?: (id: string) => void;
  /** Callback function to handle viewing the company details. */
  onView: (company: Company) => void;
}

/**
 * A card component that displays a summary of a company's information.
 * It includes the company name, website, contact details, and provides
 * actions to view, edit, or delete the company.
 */
export const CompanyCard = ({ company, onEdit, onDelete, onView }: CompanyCardProps) => {
  const { isAdmin } = useAuth(); // ← Saber si es admin

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader className="flex-grow p-4 sm:p-6">
        <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
          {company.name}
        </CardTitle>
        {company.commercialWebsite && (
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <a href={company.commercialWebsite} target="_blank" rel="noopener noreferrer" className="truncate hover:underline" onClick={(e) => e.stopPropagation()}>
              {company.commercialWebsite}
            </a>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="truncate">{company.commercialManager}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{company.managerEmail}</span>
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            Acceso: {company.brokerAccess
              ? (company.brokerAccess.length > 30 
                ? `${company.brokerAccess.slice(0, 30)}...` 
                : company.brokerAccess)
              : 'No disponible'}
          </Badge>
        </div>
      </CardContent>
      <div className="p-4 sm:p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(company)}
            className="flex-1 min-w-[80px] h-10"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          {isAdmin && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(company)}
              className="flex-1 min-w-[80px] h-10"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          {isAdmin && onDelete && (
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => onDelete(company.id)}
              className="flex-1 min-w-[80px] h-10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
