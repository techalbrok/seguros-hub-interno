
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useSpecificationCategories } from "@/hooks/useSpecificationCategories";
import type { SpecificationCategory } from "@/types";

interface SpecificationCategoryFormProps {
  companyId: string;
  category?: SpecificationCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const SpecificationCategoryForm = ({
  companyId,
  category,
  open,
  onOpenChange,
  onSuccess,
}: SpecificationCategoryFormProps) => {
  const [name, setName] = useState("");
  const { createCategory, updateCategory, isCreating, isUpdating } = useSpecificationCategories();

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      updateCategory({ id: category.id, name }, {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        }
      });
    } else {
      createCategory({ company_id: companyId, name }, {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {category ? "Actualiza el nombre de la categoría." : "Crea una nueva categoría para agrupar especificaciones."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Categoría *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Detalles Técnicos"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name || isLoading}>
              {isLoading ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
