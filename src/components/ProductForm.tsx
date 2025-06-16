
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProductBasicInfo } from "@/components/ProductBasicInfo";
import { ProductDocumentUpload } from "@/components/ProductDocumentUpload";
import { ProductRichTextFields } from "@/components/ProductRichTextFields";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductForm = ({ product, onSubmit, isLoading, open, onOpenChange }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    process: "",
    strengths: "",
    observations: "",
    categoryId: "",
    companyId: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState(product?.documents || []);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          title: product.title || "",
          process: product.process || "",
          strengths: product.strengths || "",
          observations: product.observations || "",
          categoryId: product.categoryId || "",
          companyId: product.companyId || "",
        });
        setExistingDocuments(product.documents || []);
      } else {
        setFormData({
          title: "",
          process: "",
          strengths: "",
          observations: "",
          categoryId: "",
          companyId: "",
        });
        setExistingDocuments([]);
      }
      setDocuments([]);
    }
  }, [product, open]);

  const handleExistingDocumentDelete = (documentId: string) => {
    setExistingDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, documents });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductBasicInfo 
              formData={formData}
              onFormDataChange={setFormData}
            />
            <ProductDocumentUpload
              documents={documents}
              existingDocuments={existingDocuments}
              productId={product?.id}
              onDocumentsChange={setDocuments}
              onExistingDocumentDelete={handleExistingDocumentDelete}
            />
          </div>

          <ProductRichTextFields
            formData={formData}
            onFormDataChange={setFormData}
          />

          <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-t -mb-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
