
import { useState } from "react";
import type { SpecificationCategory, Company } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { SpecificationCategoryForm } from "./SpecificationCategoryForm";
import { useSpecificationCategories } from "@/hooks/useSpecificationCategories";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpecificationCategoryManagerProps {
  company: Company;
}

export const SpecificationCategoryManager = ({ company }: SpecificationCategoryManagerProps) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SpecificationCategory | null>(null);
  const { deleteCategory, isDeleting } = useSpecificationCategories();

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: SpecificationCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };
  
  const sortedCategories = [...company.specificationCategories].sort((a,b) => (a.order || 0) - (b.order || 0));

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías de Especificaciones</CardTitle>
        <Button onClick={handleAddNew} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </CardHeader>
      <CardContent>
        {sortedCategories.length > 0 ? (
          <ul className="space-y-2">
            {sortedCategories.map(category => (
              <li key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                <span className="font-medium">{category.name}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive-outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará la categoría. Las especificaciones asociadas no se eliminarán, pero quedarán sin categoría.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)} disabled={isDeleting}>
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No hay categorías. Añade una para empezar a organizar.</p>
        )}
      </CardContent>

      <SpecificationCategoryForm
        companyId={company.id}
        category={editingCategory}
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {}}
      />
    </Card>
  );
};
