
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, FileText } from "lucide-react";
import type { Product, ProductCategory, Company } from "@/types";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useCompanies } from "@/hooks/useCompanies";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    process: product?.process || "",
    strengths: product?.strengths || "",
    observations: product?.observations || "",
    categoryId: product?.categoryId || "",
    companyId: product?.companyId || "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const { categories } = useProductCategories();
  const { companies } = useCompanies();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, documents });
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = value === "no-category" ? "" : value;
    setFormData({ ...formData, categoryId });
  };

  const handleCompanyChange = (value: string) => {
    const companyId = value === "no-company" ? "" : value;
    setFormData({ ...formData, companyId });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Categoría</Label>
                <Select
                  value={formData.categoryId || "no-category"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-category">Sin categoría</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {"—".repeat(category.level - 1)} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companyId">Compañía</Label>
                <Select
                  value={formData.companyId || "no-company"}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar compañía" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-company">Sin compañía</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="documents">Documentos Específicos</Label>
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
                      <p className="text-sm text-gray-500">Subir archivos</p>
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
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="process">Proceso</Label>
              <Textarea
                id="process"
                value={formData.process}
                onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                rows={4}
                placeholder="Describe el proceso..."
              />
            </div>

            <div>
              <Label htmlFor="strengths">Fortalezas</Label>
              <Textarea
                id="strengths"
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                rows={4}
                placeholder="Describe las fortalezas..."
              />
            </div>

            <div>
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={4}
                placeholder="Añade observaciones..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
