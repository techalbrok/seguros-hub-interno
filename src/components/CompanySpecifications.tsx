
import { useState } from "react";
import type { Company, CompanySpecification } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { CompanySpecificationForm } from "./CompanySpecificationForm";
import { useCompanySpecifications } from "@/hooks/useCompanySpecifications";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CompanySpecificationsProps {
  company: Company;
}

export const CompanySpecifications = ({ company }: CompanySpecificationsProps) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<CompanySpecification | null>(null);
  const { deleteSpecification, isDeleting } = useCompanySpecifications();

  const handleAddNew = () => {
    setEditingSpec(null);
    setFormOpen(true);
  };

  const handleEdit = (spec: CompanySpecification) => {
    setEditingSpec(spec);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    deleteSpecification(id);
  };

  const specificationsByCategory = (company.specifications || []).reduce((acc, spec) => {
    (acc[spec.category] = acc[spec.category] || []).push(spec);
    return acc;
  }, {} as Record<string, CompanySpecification[]>);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Añadir Especificación
        </Button>
      </div>
      
      {Object.keys(specificationsByCategory).length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {Object.entries(specificationsByCategory).map(([category, specs]) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
              <AccordionContent>
                {specs.map(spec => (
                  <div key={spec.id} className="prose dark:prose-invert max-w-none border-b last:border-b-0 py-4">
                    <div dangerouslySetInnerHTML={{ __html: spec.content }} />
                    <div className="flex gap-2 justify-end mt-4 not-prose">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(spec)}>
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive-ghost" size="sm">
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
                            <AlertDialogAction onClick={() => handleDelete(spec.id)} disabled={isDeleting}>
                              {isDeleting ? "Eliminando..." : "Eliminar"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-secondary/50 rounded-lg">
          <p>No hay especificaciones para esta compañía.</p>
          <p className="text-sm">Puedes añadir una haciendo clic en el botón de arriba.</p>
        </div>
      )}

      <CompanySpecificationForm
        companyId={company.id}
        specification={editingSpec}
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};
