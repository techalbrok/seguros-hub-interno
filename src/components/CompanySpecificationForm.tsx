
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useCompanySpecifications } from "@/hooks/useCompanySpecifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanySpecification, SpecificationCategory } from "@/types";

interface CompanySpecificationFormProps {
  companyId: string;
  specificationCategories: SpecificationCategory[];
  specification?: CompanySpecification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CompanySpecificationForm = ({
  companyId,
  specificationCategories,
  specification,
  open,
  onOpenChange,
  onSuccess,
}: CompanySpecificationFormProps) => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const { createSpecification, updateSpecification, isCreating, isUpdating } = useCompanySpecifications();

  useEffect(() => {
    if (specification) {
      setTitle(specification.title);
      setContent(specification.content);
      setCategoryId(specification.categoryId || undefined);
    } else {
      setTitle("");
      setContent("");
      setCategoryId(undefined);
    }
  }, [specification, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specData = {
        title,
        content,
        category_id: categoryId,
    };

    if (specification) {
      updateSpecification({ id: specification.id, ...specData }, {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        }
      });
    } else {
      createSpecification({ company_id: companyId, ...specData }, {
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
          <DialogDescription>
            {specification ? "Modifica los detalles de la especificación." : "Crea una nueva especificación para esta compañía."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ej: Cobertura de Responsabilidad Civil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={categoryId} onValueChange={(value) => setCategoryId(value === 'none' ? undefined : value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin Categoría</SelectItem>
                  {specificationCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Button type="submit" disabled={!title || !content || isLoading}>
              {isLoading ? "Guardando..." : specification ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
