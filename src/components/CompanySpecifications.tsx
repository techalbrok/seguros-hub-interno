
import { useState } from "react";
import type { Company, CompanySpecification } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { CompanySpecificationForm } from "./CompanySpecificationForm";
import { useCompanySpecifications } from "@/hooks/useCompanySpecifications";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SpecificationCategoryManager } from "./SpecificationCategoryManager";

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

  const specsByCategory = (company.specifications || []).reduce((acc, spec) => {
    const categoryId = spec.categoryId || 'uncategorized';
    (acc[categoryId] = acc[categoryId] || []).push(spec);
    return acc;
  }, {} as Record<string, CompanySpecification[]>);

  const getCategoryName = (categoryId: string) => {
    if (categoryId === 'uncategorized') return "Otras Especificaciones";
    return company.specificationCategories.find(c => c.id === categoryId)?.name || "Categoría Desconocida";
  }

  const sortedCategories = [...company.specificationCategories].sort((a,b) => (a.order || 0) - (b.order || 0));

  const categoryOrder = sortedCategories.map(c => c.id);
  if (specsByCategory['uncategorized'] && specsByCategory['uncategorized'].length > 0) {
    categoryOrder.push('uncategorized');
  }
  
  const defaultOpenCategories = categoryOrder.filter(id => specsByCategory[id] && specsByCategory[id].length > 0);

  return (
    <div>
      <SpecificationCategoryManager company={company} />

      <div className="flex justify-end my-6">
        <Button onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Añadir Especificación
        </Button>
      </div>
      
      {company.specifications.length > 0 ? (
        <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCategories}>
          {categoryOrder.map(categoryId => (
            specsByCategory[categoryId] && specsByCategory[categoryId].length > 0 && (
              <AccordionItem value={categoryId} key={categoryId}>
                <AccordionTrigger className="text-lg font-semibold">{getCategoryName(categoryId)} ({specsByCategory[categoryId].length})</AccordionTrigger>
                <AccordionContent>
                  {specsByCategory[categoryId].map(spec => (
                    <div key={spec.id} className="prose dark:prose-invert max-w-none border-b last:border-b-0 py-4">
                      <h4 className="font-bold not-prose text-base mb-2">{spec.title}</h4>
                      <div dangerouslySetInnerHTML={{ __html: spec.content }} />
                      <div className="flex gap-2 justify-end mt-4 not-prose">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(spec)}>
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
            )
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
        specificationCategories={company.specificationCategories}
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};
