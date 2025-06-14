
import type { CompanySpecification } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpecificationContentPanelProps {
  specification: CompanySpecification | null;
  onEdit: (spec: CompanySpecification) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const SpecificationContentPanel = ({ specification, onEdit, onDelete, isDeleting }: SpecificationContentPanelProps) => {
  if (!specification) {
    return (
      <div className="flex items-center justify-center h-full bg-secondary/40">
        <div className="text-center text-muted-foreground p-8">
          <p className="text-lg font-medium">Selecciona una especificación</p>
          <p className="text-sm mt-1">Elige una especificación de la lista de la izquierda para ver sus detalles aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="prose dark:prose-invert max-w-none p-6">
        <div className="flex justify-between items-start not-prose mb-4">
          <h3 className="text-2xl font-bold mt-0 pr-4">{specification.title}</h3>
          <div className="flex gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(specification)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                  <Button variant="destructive-outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente la especificación.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(specification.id)} disabled={isDeleting}>
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                      </AlertDialogAction>
                  </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: specification.content }} />
      </div>
    </ScrollArea>
  );
};
