
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, FileText } from "lucide-react";
import type { ProductCategory } from "@/types";
import { useProductCategories } from "@/hooks/useProductCategories";

interface CategoryFormProps {
  category?: ProductCategory;
  parentCategoryId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm = ({ category, parentCategoryId, onSubmit, onCancel, isLoading }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    parentId: category?.parentId || parentCategoryId || "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const { categories } = useProductCategories();

  // Filter out current category and its children to prevent circular references
  const availableParentCategories = categories.filter(cat => 
    cat.id !== category?.id && !isDescendant(cat, category?.id)
  );

  const isDescendant = (cat: ProductCategory, categoryId?: string): boolean => {
    if (!categoryId) return false;
    if (cat.parentId === categoryId) return true;
    const parent = categories.find(c => c.id === cat.parentId);
    return parent ? isDescendant(parent, categoryId) : false;
  };

  const calculateLevel = (parentId: string) => {
    if (!parentId) return 1;
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.level + 1 : 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const level = calculateLevel(formData.parentId);
    onSubmit({ ...formData, level, documents });
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleParentChange = (value: string) => {
    // Handle the special "no-parent" value
    const parentId = value === "no-parent" ? "" : value;
    setFormData({ ...formData, parentId });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la Categoría *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="parentId">Categoría Padre</Label>
              <Select
                value={formData.parentId || "no-parent"}
                onValueChange={handleParentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-parent">Sin categoría padre</SelectItem>
                  {availableParentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {"—".repeat(cat.level - 1)} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="documents">Documentos de Categoría</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={handleDocumentChange}
                  className="hidden"
                />
                <label htmlFor="documents" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Subir documentos para esta categoría</p>
                  </div>
                </label>
                
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
