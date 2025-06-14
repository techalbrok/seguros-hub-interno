
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe, Mail, User } from "lucide-react";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onView: (company: Company) => void;
}

export const CompanyCard = ({ company, onEdit, onDelete, onView }: CompanyCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(company.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onView(company)}>
            <CardTitle className="text-lg line-clamp-1">{company.name}</CardTitle>
            {company.commercialWebsite && (
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span className="truncate">{company.commercialWebsite}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className={showDeleteConfirm ? "text-red-600" : ""}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onClick={() => onView(company)}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{company.commercialManager}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{company.managerEmail}</span>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              Acceso: {company.brokerAccess.length > 30 
                ? `${company.brokerAccess.slice(0, 30)}...` 
                : company.brokerAccess}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
