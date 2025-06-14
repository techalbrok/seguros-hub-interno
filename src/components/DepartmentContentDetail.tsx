
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Building2 } from 'lucide-react';
import { DepartmentContent } from '@/hooks/useDepartmentContent';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DepartmentContentDetailProps {
  content: DepartmentContent;
  onBack: () => void;
}

export const DepartmentContentDetail: React.FC<DepartmentContentDetailProps> = ({
  content,
  onBack
}) => {
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
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <Badge variant={content.published ? "default" : "secondary"}>
              {content.published ? "Publicado" : "Borrador"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{content.profiles?.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(content.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
            </div>
            {content.departments && (
              <div className="flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>{content.departments.name}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {content.featured_image && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={renderContent(content.content)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
