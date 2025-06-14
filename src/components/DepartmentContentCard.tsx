
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Trash2, Eye, User, Calendar } from 'lucide-react';
import { DepartmentContent } from '@/hooks/useDepartmentContent';

interface DepartmentContentCardProps {
  content: DepartmentContent;
  onEdit: (content: DepartmentContent) => void;
  onDelete: (id: string) => void;
  onView: (content: DepartmentContent) => void;
}

export const DepartmentContentCard: React.FC<DepartmentContentCardProps> = ({
  content,
  onEdit,
  onDelete,
  onView
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
            <Badge variant={content.published ? "default" : "secondary"}>
                {content.published ? "Publicado" : "Borrador"}
            </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
            {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {content.featured_image && <div className="aspect-video rounded-lg overflow-hidden my-4">
            <img src={content.featured_image} alt={content.title} className="w-full h-full object-cover" />
          </div>}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{content.profiles?.name || 'Usuario'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(content.created_at)}</span>
          </div>
          {content.departments && <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{content.departments.name}</span>
            </div>}
        </div>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(content)}
            className="flex-1 min-w-[80px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(content)}
            className="flex-1 min-w-[80px]"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => onDelete(content.id)}
            className="flex-1 min-w-[80px]"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};
