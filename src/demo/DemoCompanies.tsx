
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyDetail } from "@/components/CompanyDetail";
import { CompaniesHeader } from "@/components/CompaniesHeader";
import { CompaniesControls } from "@/components/CompaniesControls";
import { CompaniesGrid } from "@/components/CompaniesGrid";
import { CompaniesList } from "@/components/CompaniesList";
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
import { useDemoAuth } from "./DemoAuthContext";

// Tipo de compañía para la demo, compatible con los componentes reales
interface DemoCompany {
  id: string;
  name: string;
  commercialManager: string;
  managerEmail: string;
  commercialWebsite: string;
  brokerAccess: string;
  createdAt: Date;
  updatedAt: Date;
}

// Clave para guardar en localStorage
const DEMO_COMPANIES_KEY = "demo_companies_list";

// Datos por defecto
const demoDefaultCompanies: DemoCompany[] = [
  { 
    id: "1", 
    name: "Compañía Demo A",
    commercialManager: "Juan Pérez",
    managerEmail: "juan.perez@demo-a.com",
    commercialWebsite: "https://www.demo-a.com",
    brokerAccess: "Acceso Mediadores A",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: "2", 
    name: "Compañía Demo B",
    commercialManager: "María Gómez",
    managerEmail: "maria.gomez@demo-b.com",
    commercialWebsite: "https://www.demo-b.com",
    brokerAccess: "Acceso Mediadores B",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type CurrentView = "main" | "detail";
type DisplayMode = "list" | "grid";
type CompanyFormData = Omit<DemoCompany, "id" | "createdAt" | "updatedAt">;

export const DemoCompanies = () => {
  const { user: authUser } = useDemoAuth();
  const isAdmin = authUser?.role === 'admin';
  const [companies, setCompanies] = useState<DemoCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<CurrentView>("main");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [selectedCompany, setSelectedCompany] = useState<DemoCompany | null>(null);
  const [editingCompany, setEditingCompany] = useState<DemoCompany | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyToDelete, setCompanyToDelete] = useState<DemoCompany | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const stored = localStorage.getItem(DEMO_COMPANIES_KEY);
      const initialCompanies = stored 
        ? JSON.parse(stored).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }))
        : demoDefaultCompanies;
      setCompanies(initialCompanies);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DEMO_COMPANIES_KEY, JSON.stringify(companies));
    }
  }, [companies, isLoading]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.commercialManager.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.managerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const companiesPerPage = displayMode === 'grid' ? 6 : 5;
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  );
  
  const handleCreateCompany = (data: CompanyFormData) => {
    const newCompany: DemoCompany = {
      ...data,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCompanies(c => [...c, newCompany]);
    setShowForm(false);
  };

  const handleUpdateCompany = (data: CompanyFormData) => {
    if (editingCompany) {
      const updatedCompany = { ...editingCompany, ...data, updatedAt: new Date() };
      setCompanies(c => c.map(co => co.id === editingCompany.id ? updatedCompany : co));
      setShowForm(false);
      if (selectedCompany?.id === editingCompany.id) {
        setSelectedCompany(updatedCompany);
      }
      setEditingCompany(null);
    }
  };

  const handleEditCompany = (company: DemoCompany) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleViewCompany = (company: DemoCompany) => {
    setSelectedCompany(company);
    setCurrentView("detail");
  };

  const handleDeleteCompany = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setCompanyToDelete(company);
    }
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      setCompanies(c => c.filter(co => co.id !== companyToDelete.id));
      if (selectedCompany?.id === companyToDelete.id) {
        setSelectedCompany(null);
        setCurrentView("main");
      }
      setCompanyToDelete(null);
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

  const deleteConfirmationDialog = (
    <AlertDialog open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la compañía{' '}
            <span className="font-semibold">{companyToDelete?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (currentView === "detail" && selectedCompany) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CompanyDetail company={selectedCompany} onEdit={isAdmin ? handleEditCompany : undefined} onBack={handleBackFromDetail} />
        {isAdmin && <CompanyForm
          open={showForm}
          onOpenChange={onFormOpenChange}
          company={editingCompany || undefined}
          onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
        />}
        {deleteConfirmationDialog}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompaniesHeader onAddNewCompany={isAdmin ? handleAddNewCompanyClick : ()=>{}} onImport={() => alert("Importación no disponible en la demo.")} />

      <Card>
        <CardHeader>
          <CompaniesControls searchTerm={searchTerm} onSearchTermChange={setSearchTerm} activeDisplayMode={displayMode} onDisplayModeChange={setDisplayMode} companyCount={filteredCompanies.length} />
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
              {searchTerm ? "No se encontraron compañías." : "No hay compañías demo."}
            </div>
          ) : (
            <>
              {displayMode === "grid" ? (
                <CompaniesGrid companies={paginatedCompanies} onEdit={isAdmin ? handleEditCompany : ()=>{}} onDelete={isAdmin ? handleDeleteCompany : ()=>{}} onView={handleViewCompany} />
              ) : (
                <CompaniesList companies={paginatedCompanies} onEdit={isAdmin ? handleEditCompany : ()=>{}} onDelete={isAdmin ? handleDeleteCompany : ()=>{}} onView={handleViewCompany} />
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
      {isAdmin && <CompanyForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        company={editingCompany || undefined}
        onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
      />}
      {deleteConfirmationDialog}
    </div>
  );
};
