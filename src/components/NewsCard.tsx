
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

  const createSnippet = (htmlContent: string, length: number = 200) => {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]+>/g, ' ');
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col md:flex-row animate-fade-in group w-full overflow-hidden">
      {news.featured_image && (
        <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto overflow-hidden">
          <img
            src={news.featured_image}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className={`flex flex-col flex-1 ${news.featured_image ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant={news.published ? "default" : "secondary"}>
              {news.published ? "Publicado" : "Borrador"}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
            {news.title}
          </CardTitle>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-1">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{news.profiles?.name || 'Usuario'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.created_at)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {createSnippet(news.content)}
          </p>
        </CardContent>
        <div className="p-6 pt-4 mt-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {news.companies && news.companies.length > 0 && <div className="flex items-center space-x-1.5"><Building2 className="w-4 h-4" /><span>{news.companies.length} compañía(s)</span></div>}
              {news.categories && news.categories.length > 0 && <div className="flex items-center space-x-1.5"><Tag className="w-4 h-4" /><span>{news.categories.length} categoría(s)</span></div>}
              {news.products && news.products.length > 0 && <div className="flex items-center space-x-1.5"><Package className="w-4 h-4" /><span>{news.products.length} producto(s)</span></div>}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => onView(news)}><Eye className="h-4 w-4 mr-1" />Ver</Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(news)}><Edit className="h-4 w-4 mr-1" />Editar</Button>
              <Button variant="destructive-outline" size="sm" onClick={() => onDelete(news.id)}><Trash2 className="h-4 w-4 mr-1" />Eliminar</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
