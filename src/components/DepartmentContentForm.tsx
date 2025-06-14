
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { Department } from '@/hooks/useDepartments';
import { DepartmentContent } from '@/hooks/useDepartmentContent';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await onUploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, featured_image: imageUrl }));
    }
    setUploading(false);
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

          <div>
            <Label>Imagen Destacada</Label>
            <div className="mt-2">
              {formData.featured_image ? (
                <div className="relative inline-block">
                  <img
                    src={formData.featured_image}
                    alt="Imagen destacada"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 text-gray-400">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                      ) : (
                        <Image className="w-12 h-12" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {uploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
                    </div>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              placeholder="Escribe el contenido aquí. Puedes incluir texto, enlaces a videos de YouTube, Vimeo, etc."
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              Tip: Para videos, puedes pegar el enlace de YouTube o Vimeo directamente en el contenido.
            </div>
          </div>

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
