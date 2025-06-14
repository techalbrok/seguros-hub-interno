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
  return <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
          <Badge variant={content.published ? "default" : "secondary"}>
            {content.published ? "Publicado" : "Borrador"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.featured_image && <div className="aspect-video rounded-lg overflow-hidden">
            <img src={content.featured_image} alt={content.title} className="w-full h-full object-cover" />
          </div>}

        

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{content.profiles?.name || 'Usuario'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(content.created_at)}</span>
          </div>
          {content.departments && <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{content.departments.name}</span>
            </div>}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onView(content)} className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(content)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(content.id)} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
};