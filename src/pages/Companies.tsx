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
type CurrentView = "main" | "form" | "detail";
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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.commercialManager.toLowerCase().includes(searchTerm.toLowerCase()) || company.managerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleCreateCompany = (data: CompanyFormData) => {
    createCompany(data);
    setCurrentView("main");
  };
  const handleUpdateCompany = (data: CompanyFormData) => {
    if (editingCompany) {
      updateCompany({
        ...data,
        id: editingCompany.id
      });
      setEditingCompany(null);
      setCurrentView("main");
    }
  };
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setCurrentView("form");
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
      setCurrentView("main");
    }
  };
  const handleAddNewCompanyClick = () => {
    setEditingCompany(null);
    setCurrentView("form");
  };
  const handleCancelForm = () => {
    setEditingCompany(null);
    setCurrentView("main");
  };
  const handleBackFromDetail = () => {
    setSelectedCompany(null);
    setCurrentView("main");
  };
  if (currentView === "form") {
    return <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CompanyForm company={editingCompany || undefined} onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} onCancel={handleCancelForm} isLoading={isCreating || isUpdating} />
      </div>;
  }
  if (currentView === "detail" && selectedCompany) {
    return <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CompanyDetail company={selectedCompany} onEdit={handleEditCompany} onBack={handleBackFromDetail} />
      </div>;
  }
  return <div className="space-y-6 p-4 sm:p-6 px-0 py-0">
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
    </div>;
}