
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useCompanySpecifications } from "@/hooks/useCompanySpecifications";
import type { CompanySpecification } from "@/types";

interface CompanySpecificationFormProps {
  companyId: string;
  specification?: CompanySpecification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CompanySpecificationForm = ({
  companyId,
  specification,
  open,
  onOpenChange,
  onSuccess,
}: CompanySpecificationFormProps) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const { createSpecification, updateSpecification, isCreating, isUpdating } = useCompanySpecifications();

  useEffect(() => {
    if (specification) {
      setCategory(specification.category);
      setContent(specification.content);
    } else {
      setCategory("");
      setContent("");
    }
  }, [specification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (specification) {
      updateSpecification({ id: specification.id, category, content }, {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        }
      });
    } else {
      createSpecification({ company_id: companyId, category, content }, {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        }
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {specification ? "Editar Especificación" : "Nueva Especificación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Ej: Detalles Técnicos"
            />
          </div>
          <div className="space-y-2">
            <RichTextEditor
              label="Contenido *"
              value={content}
              onChange={setContent}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!category || !content || isLoading}>
              {isLoading ? "Guardando..." : specification ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
