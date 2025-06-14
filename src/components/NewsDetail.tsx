
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Building2, Tag, Package } from 'lucide-react';
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

  const renderContent = (text: string) => {
    // Simple video embed detection
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g;
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g;

    let processedContent = text;
    
    // Replace YouTube links with embeds
    processedContent = processedContent.replace(youtubeRegex, (match, videoId) => {
      return `<div class="aspect-video my-4"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
    });

    // Replace Vimeo links with embeds
    processedContent = processedContent.replace(vimeoRegex, (match, videoId) => {
      return `<div class="aspect-video my-4"><iframe width="100%" height="100%" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
    });

    // Convert line breaks to paragraphs
    processedContent = processedContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    processedContent = `<p>${processedContent}</p>`;

    return { __html: processedContent };
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
            dangerouslySetInnerHTML={renderContent(news.content)}
          />

          {/* Related items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            {news.companies && news.companies.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Compañías Relacionadas
                </h3>
                <div className="space-y-1">
                  {news.companies.map((company) => (
                    <Badge key={company.id} variant="outline" className="text-xs">
                      {company.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {news.categories && news.categories.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Categorías Relacionadas
                </h3>
                <div className="space-y-1">
                  {news.categories.map((category) => (
                    <Badge key={category.id} variant="outline" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {news.products && news.products.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  Productos Relacionados
                </h3>
                <div className="space-y-1">
                  {news.products.map((product) => (
                    <Badge key={product.id} variant="outline" className="text-xs">
                      {product.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
