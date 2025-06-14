
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { EntitySelector } from '@/components/EntitySelector';
import { News, CreateNewsData } from '@/hooks/useNews';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { Company, ProductCategory } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface NewsFormProps {
  news?: News;
  onSubmit: (data: CreateNewsData) => Promise<boolean>;
  onCancel: () => void;
  companies: Company[];
  categories: ProductCategory[];
  products: Array<{ id: string; title: string; }>;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  news,
  onSubmit,
  onCancel,
  companies,
  categories,
  products
}) => {
  const [formData, setFormData] = useState<CreateNewsData>({
    title: '',
    content: '',
    featured_image: '',
    published: false,
    company_ids: [],
    category_ids: [],
    product_ids: []
  });
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();
  
  const { uploadImage, uploading } = useImageUpload('news');

  useEffect(() => {
    console.log('NewsForm - Setting form data from news:', news);
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        featured_image: news.featured_image || '',
        published: news.published,
        company_ids: news.companies?.map(c => c.id) || [],
        category_ids: news.categories?.map(c => c.id) || [],
        product_ids: news.products?.map(p => p.id) || []
      });
    }
  }, [news]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('NewsForm - Image upload triggered');
    
    if (!event.target.files || event.target.files.length === 0) {
      console.log('NewsForm - No file selected');
      return;
    }

    const file = event.target.files[0];
    console.log('NewsForm - File selected:', file.name, file.size);
    
    try {
      const imageUrl = await uploadImage(file);
      console.log('NewsForm - Image uploaded successfully:', imageUrl);
      
      if (imageUrl) {
        setFormData(prev => ({ ...prev, featured_image: imageUrl }));
      }
    } catch (error) {
      console.error('NewsForm - Error uploading image:', error);
    }
  };

  const handleImageChange = (url: string) => {
    console.log('NewsForm - Image URL changed:', url);
    setFormData(prev => ({ ...prev, featured_image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('NewsForm - Submitting form with data:', formData);
    
    setSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      console.log('NewsForm - Submit result:', success);
      
      if (success && !news) {
        // Solo resetear el formulario si es una nueva noticia y fue exitoso
        setFormData({
          title: '',
          content: '',
          featured_image: '',
          published: false,
          company_ids: [],
          category_ids: [],
          product_ids: []
        });
      }
    } catch (error) {
      console.error('NewsForm - Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{news ? 'Editar Noticia' : 'Nueva Noticia'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={!isAdmin} className="space-y-6">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <RichTextEditor
              label="Contenido"
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="Escribe el contenido de la noticia. Puedes incluir enlaces de YouTube o Vimeo que se convertirán automáticamente en videos incrustados."
              required
            />

            <ImageUpload
              label="Imagen Destacada"
              imageUrl={formData.featured_image}
              uploading={uploading}
              onImageChange={handleImageChange}
              onImageUpload={handleImageUpload}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published">Publicar noticia</Label>
            </div>

            <EntitySelector
              label="Compañías Relacionadas"
              placeholder="Seleccionar compañía"
              entities={companies}
              selectedIds={formData.company_ids || []}
              getEntityId={(company) => company.id}
              getEntityName={(company) => company.name}
              onAdd={(id) => setFormData(prev => ({
                ...prev,
                company_ids: [...(prev.company_ids || []), id]
              }))}
              onRemove={(id) => setFormData(prev => ({
                ...prev,
                company_ids: prev.company_ids?.filter(cid => cid !== id) || []
              }))}
            />

            <EntitySelector
              label="Categorías de Productos Relacionadas"
              placeholder="Seleccionar categoría"
              entities={categories}
              selectedIds={formData.category_ids || []}
              getEntityId={(category) => category.id}
              getEntityName={(category) => category.name}
              onAdd={(id) => setFormData(prev => ({
                ...prev,
                category_ids: [...(prev.category_ids || []), id]
              }))}
              onRemove={(id) => setFormData(prev => ({
                ...prev,
                category_ids: prev.category_ids?.filter(cid => cid !== id) || []
              }))}
            />

            <EntitySelector
              label="Productos Relacionados"
              placeholder="Seleccionar producto"
              entities={products}
              selectedIds={formData.product_ids || []}
              getEntityId={(product) => product.id}
              getEntityName={(product) => product.title}
              onAdd={(id) => setFormData(prev => ({
                ...prev,
                product_ids: [...(prev.product_ids || []), id]
              }))}
              onRemove={(id) => setFormData(prev => ({
                ...prev,
                product_ids: prev.product_ids?.filter(pid => pid !== id) || []
              }))}
            />
          </fieldset>
          
          <div className="flex gap-4">
            {isAdmin && (
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Guardando...' : (news ? 'Actualizar' : 'Crear')} Noticia
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              {isAdmin ? 'Cancelar' : 'Volver'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
