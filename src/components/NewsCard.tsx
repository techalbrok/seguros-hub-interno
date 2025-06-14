
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
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
          <Badge variant={news.published ? "default" : "secondary"}>
            {news.published ? "Publicado" : "Borrador"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.featured_image && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={news.featured_image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {news.content.substring(0, 150)}...
        </div>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{news.profiles?.name || 'Usuario'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.created_at)}</span>
          </div>
          
          {news.companies && news.companies.length > 0 && (
            <div className="flex items-center space-x-1">
              <Building2 className="w-3 h-3" />
              <span>{news.companies.length} compañía(s)</span>
            </div>
          )}
          
          {news.categories && news.categories.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>{news.categories.length} categoría(s)</span>
            </div>
          )}
          
          {news.products && news.products.length > 0 && (
            <div className="flex items-center space-x-1">
              <Package className="w-3 h-3" />
              <span>{news.products.length} producto(s)</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(news)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(news)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(news.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
