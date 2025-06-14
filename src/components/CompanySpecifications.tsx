
import { useState, useMemo, useEffect } from "react";
import type { Company, CompanySpecification } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Settings } from "lucide-react";
import { CompanySpecificationForm } from "./CompanySpecificationForm";
import { useCompanySpecifications } from "@/hooks/useCompanySpecifications";
import { SpecificationCategoryManager } from "./SpecificationCategoryManager";
import { SpecificationsSidebar } from "./SpecificationsSidebar";
import { SpecificationContentPanel } from "./SpecificationContentPanel";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CompanySpecificationsProps {
  company: Company;
}

export const CompanySpecifications = ({ company }: CompanySpecificationsProps) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<CompanySpecification | null>(null);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { deleteSpecification, isDeleting } = useCompanySpecifications();

  useEffect(() => {
    if (!selectedSpecId && company.specifications && company.specifications.length > 0) {
      const sortedCategories = [...company.specificationCategories].sort((a,b) => (a.order || 0) - (b.order || 0));
      const categoryOrder = sortedCategories.map(c => c.id);
      
      const allSpecsOrdered = categoryOrder
        .flatMap(catId => company.specifications.filter(s => s.categoryId === catId))
        .concat(company.specifications.filter(s => !s.categoryId || !categoryOrder.includes(s.categoryId!)));

      if (allSpecsOrdered.length > 0) {
        setSelectedSpecId(allSpecsOrdered[0].id);
      }
    }
  }, [company.specifications, company.specificationCategories, selectedSpecId]);

  const handleAddNew = () => {
    setEditingSpec(null);
    setFormOpen(true);
  };

  const handleEdit = (spec: CompanySpecification) => {
    setEditingSpec(spec);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    deleteSpecification(id, {
        onSuccess: () => {
            if (selectedSpecId === id) {
                setSelectedSpecId(null);
            }
        }
    });
  };

  const selectedSpec = useMemo(() => {
    if (!selectedSpecId) return null;
    return company.specifications.find(s => s.id === selectedSpecId) || null;
  }, [selectedSpecId, company.specifications]);

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 280px)'}}>
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="success">
                        <Settings className="h-4 w-4 mr-2" />
                        Categorías
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Gestionar Categorías</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <SpecificationCategoryManager company={company} />
                    </div>
                </DialogContent>
            </Dialog>
            <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar especificación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                />
            </div>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Añadir Especificación
        </Button>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 overflow-hidden">
        <div className="col-span-1 border-r overflow-y-auto bg-muted/20">
            <SpecificationsSidebar 
                company={company}
                searchTerm={searchTerm}
                selectedSpecId={selectedSpecId}
                onSelectSpec={setSelectedSpecId}
            />
        </div>
        <div className="col-span-1 md:col-span-2 xl:col-span-3 overflow-y-auto">
             <SpecificationContentPanel 
                specification={selectedSpec}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
      </div>
      
      <CompanySpecificationForm
        companyId={company.id}
        specification={editingSpec}
        specificationCategories={company.specificationCategories}
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          setFormOpen(false);
        }}
      />
    </div>
  );
};
