
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductBasicInfo } from "@/components/ProductBasicInfo";
import { ProductDocumentUpload } from "@/components/ProductDocumentUpload";
import { ProductRichTextFields } from "@/components/ProductRichTextFields";
import type { Product } from "@/types";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, documents });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductBasicInfo 
              formData={formData}
              onFormDataChange={setFormData}
            />

            <ProductDocumentUpload
              documents={documents}
              onDocumentsChange={setDocuments}
            />
          </div>

          <ProductRichTextFields
            formData={formData}
            onFormDataChange={setFormData}
          />

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
