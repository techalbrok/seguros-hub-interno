
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Building2 } from 'lucide-react';
import { DepartmentContent } from '@/hooks/useDepartmentContent';

interface DepartmentContentDetailProps {
  content: DepartmentContent;
  onBack: () => void;
}

export const DepartmentContentDetail: React.FC<DepartmentContentDetailProps> = ({
  content,
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
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <Badge variant={content.published ? "default" : "secondary"}>
              {content.published ? "Publicado" : "Borrador"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{content.profiles?.name || 'Usuario'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(content.created_at)}</span>
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
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
