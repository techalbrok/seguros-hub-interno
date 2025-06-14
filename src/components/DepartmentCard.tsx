
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Edit, Trash2, FileText } from 'lucide-react';
import { Department } from '@/hooks/useDepartments';

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
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{department.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{contentCount}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Responsable
          </div>
          <div className="text-sm">{department.responsible_name}</div>
          {department.responsible_email && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-3 h-3" />
              <span>{department.responsible_email}</span>
            </div>
          )}
        </div>

        {department.description && (
          <div>
            <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Descripción
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {department.description}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewContent(department.id)}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-1" />
            Contenido
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(department)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(department.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
