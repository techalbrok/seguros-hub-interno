
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types";
import { Trash2 } from "lucide-react";

interface CompaniesListProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
  onView: (company: Company) => void;
}

export const CompaniesList = ({
  companies,
  onEdit,
  onDelete,
  onView,
}: CompaniesListProps) => {
  return (
    <div className="space-y-2">
      {companies.map((company) => (
        <Card key={company.id} className="hover:shadow-md transition-shadow">
          <CardContent 
            className="p-4 flex items-center justify-between cursor-pointer" 
            onClick={() => onView(company)}
          >
            <div className="flex-1">
              <h3 className="font-semibold">{company.name}</h3>
              <p className="text-sm text-muted-foreground">
                {company.commercialManager} • {company.managerEmail}
              </p>
              {company.commercialWebsite && (
                <p className="text-xs text-blue-600 mt-1 truncate">{company.commercialWebsite}</p>
              )}
            </div>
            <div className="flex gap-1 sm:gap-2 ml-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(company);
                  }}
                >
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive-outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(company.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
