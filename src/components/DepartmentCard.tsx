
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Edit, Trash2, FileText } from 'lucide-react';
import { Department } from '@/hooks/useDepartments';
import { useAuth } from "@/hooks/useAuth"; // <--- Nuevo import

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  onViewContent: (departmentId: string) => void;
  contentCount?: number;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  onDelete,
  onViewContent,
  contentCount = 0
}) => {
  const { isAdmin } = useAuth();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>{department.name}</span>
              </div>
            </CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{contentCount}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
            Responsable
          </h4>
          <p className="text-sm text-foreground/80">{department.responsible_name}</p>
          {department.responsible_email && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
              <Mail className="w-3 h-3" />
              <span>{department.responsible_email}</span>
            </div>
          )}
        </div>

        {department.description && (
          <div>
            <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
              Descripción
            </h4>
            <p className="text-sm text-foreground/80 line-clamp-3">
              {department.description}
            </p>
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewContent(department.id)}
            className="flex-1 min-w-[80px]"
          >
            <FileText className="w-4 h-4 mr-1" />
            Contenido
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(department)}
                className="flex-1 min-w-[80px]"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="destructive-outline"
                size="sm"
                onClick={() => onDelete(department.id)}
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

