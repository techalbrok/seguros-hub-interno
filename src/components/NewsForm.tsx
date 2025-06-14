
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image } from 'lucide-react';
import { News, CreateNewsData } from '@/hooks/useNews';
import { useCompanies } from '@/hooks/useCompanies';
import { useProductCategories } from '@/hooks/useProductCategories';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsFormProps {
  news?: News;
  onSubmit: (data: CreateNewsData) => Promise<boolean>;
  onCancel: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  news,
  onSubmit,
  onCancel
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
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { companies } = useCompanies();
  const { categories } = useProductCategories();
  const { products } = useProducts();
  const { toast } = useToast();

  useEffect(() => {
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
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('news')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        featured_image: data.publicUrl
      }));

      toast({
        title: "Éxito",
        description: "Imagen subida correctamente",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const success = await onSubmit(formData);
    if (success) {
      if (!news) {
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
    }
    
    setSubmitting(false);
  };

  const addCompany = (companyId: string) => {
    if (!formData.company_ids?.includes(companyId)) {
      setFormData(prev => ({
        ...prev,
        company_ids: [...(prev.company_ids || []), companyId]
      }));
    }
  };

  const removeCompany = (companyId: string) => {
    setFormData(prev => ({
      ...prev,
      company_ids: prev.company_ids?.filter(id => id !== companyId) || []
    }));
  };

  const addCategory = (categoryId: string) => {
    if (!formData.category_ids?.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        category_ids: [...(prev.category_ids || []), categoryId]
      }));
    }
  };

  const removeCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids?.filter(id => id !== categoryId) || []
    }));
  };

  const addProduct = (productId: string) => {
    if (!formData.product_ids?.includes(productId)) {
      setFormData(prev => ({
        ...prev,
        product_ids: [...(prev.product_ids || []), productId]
      }));
    }
  };

  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids?.filter(id => id !== productId) || []
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{news ? 'Editar Noticia' : 'Nueva Noticia'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              placeholder="Escribe el contenido de la noticia. Puedes incluir enlaces de YouTube o Vimeo que se convertirán automáticamente en videos incrustados."
              required
            />
          </div>

          <div>
            <Label htmlFor="featured_image">Imagen Destacada</Label>
            <div className="space-y-4">
              {formData.featured_image && (
                <div className="relative">
                  <img
                    src={formData.featured_image}
                    alt="Vista previa"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
                >
                  {uploading ? (
                    <Upload className="w-4 h-4 animate-spin" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">Publicar noticia</Label>
          </div>

          {/* Companies Section */}
          <div>
            <Label>Compañías Relacionadas</Label>
            <div className="space-y-2">
              <Select onValueChange={addCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar compañía" />
                </SelectTrigger>
                <SelectContent>
                  {companies
                    .filter(company => !formData.company_ids?.includes(company.id))
                    .map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {formData.company_ids?.map(companyId => {
                  const company = companies.find(c => c.id === companyId);
                  return company ? (
                    <Badge key={companyId} variant="secondary" className="flex items-center gap-1">
                      {company.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeCompany(companyId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <Label>Categorías de Productos Relacionadas</Label>
            <div className="space-y-2">
              <Select onValueChange={addCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(category => !formData.category_ids?.includes(category.id))
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {formData.category_ids?.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {category.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeCategory(categoryId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <Label>Productos Relacionados</Label>
            <div className="space-y-2">
              <Select onValueChange={addProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter(product => !formData.product_ids?.includes(product.id))
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {formData.product_ids?.map(productId => {
                  const product = products.find(p => p.id === productId);
                  return product ? (
                    <Badge key={productId} variant="secondary" className="flex items-center gap-1">
                      {product.title}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeProduct(productId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : (news ? 'Actualizar' : 'Crear')} Noticia
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
