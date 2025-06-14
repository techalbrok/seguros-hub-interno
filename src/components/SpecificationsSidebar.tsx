
import { useMemo } from 'react';
import type { Company, CompanySpecification } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SpecificationsSidebarProps {
  company: Company;
  searchTerm: string;
  selectedSpecId: string | null;
  onSelectSpec: (id: string) => void;
}

export const SpecificationsSidebar = ({ company, searchTerm, selectedSpecId, onSelectSpec }: SpecificationsSidebarProps) => {
  const filteredSpecs = useMemo(() => {
    if (!searchTerm) {
      return company.specifications || [];
    }
    return (company.specifications || []).filter(
      (spec) =>
        spec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [company.specifications, searchTerm]);

  const specsByCategory = useMemo(() => {
    return filteredSpecs.reduce((acc, spec) => {
      const categoryId = spec.categoryId || 'uncategorized';
      (acc[categoryId] = acc[categoryId] || []).push(spec);
      return acc;
    }, {} as Record<string, CompanySpecification[]>);
  }, [filteredSpecs]);

  const getCategoryName = (categoryId: string) => {
    if (categoryId === 'uncategorized') return "Otras Especificaciones";
    return company.specificationCategories.find(c => c.id === categoryId)?.name || "Categoría Desconocida";
  }

  const sortedCategories = [...company.specificationCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const categoryOrder = sortedCategories.map(c => c.id);
  if (specsByCategory['uncategorized'] && specsByCategory['uncategorized'].length > 0) {
    categoryOrder.push('uncategorized');
  }
  
  const defaultOpenCategories = searchTerm ? categoryOrder.filter(id => specsByCategory[id] && specsByCategory[id].length > 0) : categoryOrder;

  if (filteredSpecs.length === 0) {
    return (
        <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
            <div>
             {searchTerm ? "No se encontraron especificaciones." : "Esta compañía no tiene especificaciones."}
            </div>
        </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCategories}>
        {categoryOrder.map(categoryId => (
          specsByCategory[categoryId] && specsByCategory[categoryId].length > 0 && (
            <AccordionItem value={categoryId} key={categoryId}>
              <AccordionTrigger className="text-base font-semibold px-4 py-2 hover:bg-accent/50">
                {getCategoryName(categoryId)} ({specsByCategory[categoryId].length})
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <ul className="flex flex-col border-t">
                  {specsByCategory[categoryId].map(spec => (
                    <li key={spec.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => onSelectSpec(spec.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm hover:bg-accent/80 transition-colors",
                          selectedSpecId === spec.id ? "bg-primary/10 text-primary font-semibold" : ""
                        )}
                      >
                        {spec.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        ))}
      </Accordion>
    </ScrollArea>
  );
};
