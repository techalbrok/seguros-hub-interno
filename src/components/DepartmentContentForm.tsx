
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { Department } from '@/hooks/useDepartments';
import { DepartmentContent } from '@/hooks/useDepartmentContent';
import { useImageUpload } from '@/hooks/useImageUpload';

interface DepartmentContentFormProps {
  departments: Department[];
  content?: DepartmentContent;
  onSubmit: (data: {
    title: string;
    content: string;
    department_id: string;
    featured_image?: string;
    published?: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

export const DepartmentContentForm: React.FC<DepartmentContentFormProps> = ({
  departments,
  content,
  onSubmit,
  onCancel,
  onUploadImage
}) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    content: content?.content || '',
    department_id: content?.department_id || '',
    featured_image: content?.featured_image || '',
    published: content?.published || false
  });
  const [loading, setLoading] = useState(false);
  const { uploading } = useImageUpload('department-content');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await onUploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, featured_image: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        title: '',
        content: '',
        department_id: '',
        featured_image: '',
        published: false
      });
      onCancel();
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {content ? 'Editar Contenido' : 'Nueva Entrada'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="department_id">Departamento</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ImageUpload
            label="Imagen Destacada"
            imageUrl={formData.featured_image}
            uploading={uploading}
            onImageChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
            onImageUpload={handleImageUpload}
          />

          <RichTextEditor
            label="Contenido"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Escribe el contenido aquí. Puedes incluir texto, enlaces a videos de YouTube, Vimeo, etc."
            required
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published">Publicar</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Guardando...' : content ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
