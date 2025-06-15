import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCompanies, CreateCompanyData } from "@/hooks/useCompanies";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyDetail } from "@/components/CompanyDetail";
import { CompaniesHeader } from "@/components/CompaniesHeader";
import { CompaniesControls } from "@/components/CompaniesControls";
import { CompaniesGrid } from "@/components/CompaniesGrid";
import { CompaniesList } from "@/components/CompaniesList";
import type { Company } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { AppPagination } from "@/components/ui/AppPagination";
import { CompanyCardSkeleton, CompanyListSkeleton } from "@/components/skeletons/CompanySkeletons";
import { CompanyImportDialog } from "@/components/companies/CompanyImportDialog";
import { useAuth } from "@/hooks/useAuth";

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
    isUpdating,
    isDeleting,
    bulkCreateCompanies,
  } = useCompanies();

  const { permissions } = useAuth();
  const canCreate = permissions?.companies?.canCreate ?? false;
  const canEdit = permissions?.companies?.canEdit ?? false;
  const canDelete = permissions?.companies?.canDelete ?? false;

  const [currentView, setCurrentView] = useState<CurrentView>("main");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.commercialManager.toLowerCase().includes(searchTerm.toLowerCase()) || company.managerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const companiesPerPage = displayMode === 'grid' ? 6 : 5;
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  );
  
  const handleCreateCompany = (data: CompanyFormData) => {
    if (!canCreate) return;
    createCompany(data, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateCompany = (data: CompanyFormData) => {
    if (!canEdit) return;
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
    if (!canEdit) return;
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView("detail");
  };

  const handleDeleteCompany = (id: string) => {
    if (!canDelete) return;
    const company = companies.find((c) => c.id === id);
    if (company) {
      setCompanyToDelete(company);
    }
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete.id, {
        onSuccess: () => {
          if (selectedCompany?.id === companyToDelete.id) {
            setSelectedCompany(null);
            setCurrentView("main");
          }
          if (editingCompany?.id === companyToDelete.id) {
            setEditingCompany(null);
            setShowForm(false);
          }
          setCompanyToDelete(null);
        },
        onError: () => {
          setCompanyToDelete(null);
        },
      });
    }
  };

  const handleBulkCreateCompanies = async (companiesData: CreateCompanyData[]) => {
    if (!canCreate || !bulkCreateCompanies) return;
    await bulkCreateCompanies(companiesData);
  };

  const handleAddNewCompanyClick = () => {
    if (!canCreate) return;
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

  const deleteConfirmationDialog = (
    <AlertDialog open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la compañía{' '}
            <span className="font-semibold">{companyToDelete?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (currentView === "detail" && selectedCompany) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CompanyDetail
          company={selectedCompany}
          onEdit={canEdit ? handleEditCompany : undefined}
          onBack={handleBackFromDetail}
        />
        <CompanyForm
          open={showForm}
          onOpenChange={onFormOpenChange}
          company={editingCompany || undefined}
          onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
          isLoading={isCreating || isUpdating}
        />
        {deleteConfirmationDialog}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <CompaniesHeader
        onAddNewCompany={canCreate ? handleAddNewCompanyClick : undefined}
        onImport={canCreate ? () => setIsImportDialogOpen(true) : undefined}
      />

      <Card>
        <CardHeader>
          <CompaniesControls
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            activeDisplayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
            companyCount={filteredCompanies.length}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            displayMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)}
              </div>
            ) : (
              <CompanyListSkeleton />
            )
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No se encontraron compañías que coincidan con la búsqueda." : "No hay compañías registradas. ¡Añade una!"}
            </div>
          ) : (
            <>
              {displayMode === "grid" ? (
                <CompaniesGrid
                  companies={paginatedCompanies}
                  onEdit={canEdit ? handleEditCompany : undefined}
                  onDelete={canDelete ? handleDeleteCompany : undefined}
                  onView={handleViewCompany}
                />
              ) : (
                <CompaniesList
                  companies={paginatedCompanies}
                  onEdit={canEdit ? handleEditCompany : undefined}
                  onDelete={canDelete ? handleDeleteCompany : undefined}
                  onView={handleViewCompany}
                />
              )}
              {totalPages > 1 && (
                <AppPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  className="mt-6"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
      <CompanyForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        company={editingCompany || undefined}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        isLoading={isCreating || isUpdating}
      />
      {deleteConfirmationDialog}
      <CompanyImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onBulkCreate={handleBulkCreateCompanies}
      />
    </div>
  );
}
