
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Trash2, Eye, User, Calendar, Building2, Package, Tag } from 'lucide-react';
import { News } from '@/hooks/useNews';

interface NewsCardProps {
  news: News;
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
  onView: (news: News) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
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
            <Badge variant={news.published ? "default" : "secondary"}>
                {news.published ? "Publicado" : "Borrador"}
            </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
            {news.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {news.featured_image && <div className="aspect-video rounded-lg overflow-hidden my-4">
            <img src={news.featured_image} alt={news.title} className="w-full h-full object-cover" />
          </div>}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{news.profiles?.name || 'Usuario'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(news.created_at)}</span>
          </div>
          
          {news.companies && news.companies.length > 0 && <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>{news.companies.length} compañía(s)</span>
            </div>}
          
          {news.categories && news.categories.length > 0 && <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>{news.categories.length} categoría(s)</span>
            </div>}
          
          {news.products && news.products.length > 0 && <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>{news.products.length} producto(s)</span>
            </div>}
        </div>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(news)}
            className="flex-1 min-w-[80px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(news)}
            className="flex-1 min-w-[80px]"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => onDelete(news.id)}
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
