
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Building2, Package, Tag } from 'lucide-react';
import { News } from '@/hooks/useNews';

interface NewsDetailProps {
  news: News;
  onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({
  news,
  onBack
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{news.title}</CardTitle>
            <Badge variant={news.published ? "default" : "secondary"}>
              {news.published ? "Publicado" : "Borrador"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{news.profiles?.name || 'Usuario'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.created_at)}</span>
            </div>
            
            {news.companies && news.companies.length > 0 && (
              <div className="flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>{news.companies.length} compañía(s)</span>
              </div>
            )}
            
            {news.categories && news.categories.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{news.categories.length} categoría(s)</span>
              </div>
            )}
            
            {news.products && news.products.length > 0 && (
              <div className="flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>{news.products.length} producto(s)</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {news.featured_image && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={news.featured_image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Mostrar entidades relacionadas */}
          {(news.companies?.length || news.categories?.length || news.products?.length) && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Contenido Relacionado</h3>
              
              {news.companies && news.companies.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Compañías:</h4>
                  <div className="flex flex-wrap gap-2">
                    {news.companies.map(company => (
                      <Badge key={company.id} variant="outline">
                        {company.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {news.categories && news.categories.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Categorías de Productos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {news.categories.map(category => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {news.products && news.products.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Productos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {news.products.map(product => (
                      <Badge key={product.id} variant="outline">
                        {product.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
