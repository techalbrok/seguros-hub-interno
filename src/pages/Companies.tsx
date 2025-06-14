import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyDetail } from "@/components/CompanyDetail";
import { CompaniesHeader } from "@/components/CompaniesHeader";
import { CompaniesControls } from "@/components/CompaniesControls";
import { CompaniesGrid } from "@/components/CompaniesGrid";
import { CompaniesList } from "@/components/CompaniesList";
import type { Company } from "@/types";
type CurrentView = "main" | "detail";
type DisplayMode = "list" | "grid";

// Define the type for company data used in forms, excluding auto-generated fields
type CompanyFormData = Omit<Company, "id" | "createdAt" | "updatedAt">;
export default function Companies() {
  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating
  } = useCompanies();
  const [currentView, setCurrentView] = useState<CurrentView>("main");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.commercialManager.toLowerCase().includes(searchTerm.toLowerCase()) || company.managerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const handleCreateCompany = (data: CompanyFormData) => {
    createCompany(data, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateCompany = (data: CompanyFormData) => {
    if (editingCompany) {
      updateCompany({
        ...data,
        id: editingCompany.id
      }, {
        onSuccess: (updatedCompany) => {
          setShowForm(false);
          if (selectedCompany?.id === editingCompany.id) {
            setSelectedCompany(updatedCompany);
          }
          setEditingCompany(null);
        }
      });
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView("detail");
  };
  const handleDeleteCompany = (id: string) => {
    deleteCompany(id);
    if (selectedCompany?.id === id) {
      setSelectedCompany(null);
      setCurrentView("main");
    }
    if (editingCompany?.id === id) {
      setEditingCompany(null);
      setShowForm(false);
    }
  };
  const handleAddNewCompanyClick = () => {
    setEditingCompany(null);
    setShowForm(true);
  };
  const handleBackFromDetail = () => {
    setSelectedCompany(null);
    setCurrentView("main");
  };

  const onFormOpenChange = (isOpen: boolean) => {
    setShowForm(isOpen);
    if (!isOpen) {
      setEditingCompany(null);
    }
  }

  if (currentView === "detail" && selectedCompany) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CompanyDetail company={selectedCompany} onEdit={handleEditCompany} onBack={handleBackFromDetail} />
        <CompanyForm
          open={showForm}
          onOpenChange={onFormOpenChange}
          company={editingCompany || undefined}
          onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <CompaniesHeader onAddNewCompany={handleAddNewCompanyClick} />

      <Card>
        <CardHeader>
          <CompaniesControls searchTerm={searchTerm} onSearchTermChange={setSearchTerm} activeDisplayMode={displayMode} onDisplayModeChange={setDisplayMode} companyCount={filteredCompanies.length} />
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div> : filteredCompanies.length === 0 ? <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No se encontraron compañías que coincidan con la búsqueda." : "No hay compañías registradas. ¡Añade una!"}
            </div> : displayMode === "grid" ? <CompaniesGrid companies={filteredCompanies} onEdit={handleEditCompany} onDelete={handleDeleteCompany} onView={handleViewCompany} /> : <CompaniesList companies={filteredCompanies} onEdit={handleEditCompany} onDelete={handleDeleteCompany} onView={handleViewCompany} />}
        </CardContent>
      </Card>
      <CompanyForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        company={editingCompany || undefined}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
