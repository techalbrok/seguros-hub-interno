import { useState, useEffect } from "react";
import { useDemoAuth } from "./DemoAuthContext";
import type { Delegation } from "@/types";
import { DelegationsPageHeader } from "@/components/delegations/DelegationsPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DelegationsControls } from "@/components/delegations/DelegationsControls";
import { DelegationsEmptyState } from "@/components/delegations/DelegationsEmptyState";
import { DelegationsGrid } from "@/components/delegations/DelegationsGrid";
import { DelegationsList } from "@/components/delegations/DelegationsList";
import { AppPagination } from "@/components/ui/AppPagination";
import { DelegationForm } from "@/components/DelegationForm";
import { DelegationDetail } from "@/components/DelegationDetail";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { DelegationsLoading } from "@/components/delegations/DelegationsLoading";

const DEMO_DELEGATIONS_KEY = "demo_delegations_list";

const demoDefaultDelegations: Delegation[] = [
  { 
    id: "1", 
    name: "Central Demo",
    legalName: "Delegación Central Demo S.L.",
    address: "Calle Falsa 123, 08001 Barcelona, España",
    phone: "+34 930 000 001",
    email: "central@demo.com",
    website: "https://central.demo.com",
    contactPerson: "Juan Pérez",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: "2", 
    name: "Sucursal Norte Demo",
    legalName: "Delegación Norte Demo S.A.",
    address: "Avenida de la Industria 45, 28002 Madrid, España",
    phone: "+34 910 000 002",
    email: "norte@demo.com",
    website: "https://norte.demo.com",
    contactPerson: "María Gómez",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const t = { singular: "Delegación", plural: "Delegaciones" };

type CurrentView = "main" | "detail";
type DisplayMode = "grid" | "list";
type DelegationFormData = Omit<Delegation, "id" | "createdAt" | "updatedAt">;

export const DemoDelegations = () => {
  const { user: authUser } = useDemoAuth();
  const isAdmin = authUser?.role === 'admin';
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentView, setCurrentView] = useState<CurrentView>("main");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [delegationToDelete, setDelegationToDelete] = useState<Delegation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(DEMO_DELEGATIONS_KEY);
      const initialDelegations = stored 
        ? JSON.parse(stored).map((d: any) => ({ ...d, createdAt: new Date(d.createdAt), updatedAt: new Date(d.updatedAt) }))
        : demoDefaultDelegations;
      setDelegations(initialDelegations);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DEMO_DELEGATIONS_KEY, JSON.stringify(delegations));
    }
  }, [delegations, isLoading]);

  const filteredDelegations = delegations.filter(delegation =>
    delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const delegationsPerPage = displayMode === 'grid' ? 6 : 5;
  const totalPages = Math.ceil(filteredDelegations.length / delegationsPerPage);
  const paginatedDelegations = filteredDelegations.slice(
    (currentPage - 1) * delegationsPerPage,
    currentPage * delegationsPerPage
  );

  const handleCreateDelegation = async (data: DelegationFormData): Promise<boolean> => {
    const newDelegation: Delegation = {
      ...data,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDelegations(d => [...d, newDelegation]);
    return true;
  };
  
  const handleUpdateDelegation = async (data: DelegationFormData): Promise<boolean> => {
    if (editingDelegation) {
      const updatedDelegation = { ...editingDelegation, ...data, updatedAt: new Date() };
      setDelegations(d => d.map(del => del.id === editingDelegation.id ? updatedDelegation : del));
      if (selectedDelegation?.id === editingDelegation.id) {
        setSelectedDelegation(updatedDelegation);
      }
      setEditingDelegation(null);
      return true;
    }
    return false;
  };

  const handleEditDelegation = (delegation: Delegation) => {
    setEditingDelegation(delegation);
    setShowForm(true);
  };
  
  const handleViewDelegation = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setCurrentView("detail");
  };
  
  const handleDeleteDelegation = (id: string) => {
    const delegation = delegations.find((d) => d.id === id);
    if (delegation) {
      setDelegationToDelete(delegation);
    }
  };
  
  const handleConfirmDelete = () => {
    if (delegationToDelete) {
      setDelegations(d => d.filter(del => del.id !== delegationToDelete.id));
      if (selectedDelegation?.id === delegationToDelete.id) {
        setSelectedDelegation(null);
        setCurrentView("main");
      }
      setDelegationToDelete(null);
    }
  };

  const handleAddNewDelegationClick = () => {
    setEditingDelegation(null);
    setShowForm(true);
  };
  
  const handleBackFromDetail = () => {
    setSelectedDelegation(null);
    setCurrentView("main");
  };

  const onFormOpenChange = (isOpen: boolean) => {
    setShowForm(isOpen);
    if (!isOpen) {
      setEditingDelegation(null);
    }
  }

  const deleteConfirmationDialog = (
    <AlertDialog open={!!delegationToDelete} onOpenChange={(open) => !open && setDelegationToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la delegación{' '}
            <span className="font-semibold">{delegationToDelete?.name}</span>.
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

  if (isLoading) {
    return <DelegationsLoading t={t} />;
  }
  
  if (currentView === "detail" && selectedDelegation) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DelegationDetail
          delegation={selectedDelegation}
          onBack={handleBackFromDetail}
          onEdit={isAdmin ? () => handleEditDelegation(selectedDelegation) : undefined}
          onDelete={isAdmin ? () => handleDeleteDelegation(selectedDelegation.id) : undefined}
        />
        {isAdmin && <DelegationForm
          open={showForm}
          onOpenChange={onFormOpenChange}
          delegation={editingDelegation || undefined}
          onSubmit={editingDelegation ? handleUpdateDelegation : handleCreateDelegation}
        />}
        {deleteConfirmationDialog}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DelegationsPageHeader t={t} onCreateClick={isAdmin ? handleAddNewDelegationClick : ()=>{}} onImportClick={() => alert("Importación no disponible en la demo.")} />
      
      <Card>
        <CardHeader>
          <DelegationsControls
            t={t}
            filteredCount={filteredDelegations.length}
            totalCount={delegations.length}
            viewMode={displayMode}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onViewModeChange={setDisplayMode}
          />
        </CardHeader>
        <CardContent>
          {filteredDelegations.length === 0 ? (
            <DelegationsEmptyState t={t} hasSearchTerm={!!searchTerm} onCreateClick={handleAddNewDelegationClick} />
          ) : (
            <>
              {displayMode === "grid" ? (
                <DelegationsGrid delegations={paginatedDelegations} onEdit={isAdmin ? handleEditDelegation : ()=>{}} onDelete={isAdmin ? handleDeleteDelegation : ()=>{}} onView={handleViewDelegation} />
              ) : (
                <DelegationsList delegations={paginatedDelegations} onEdit={isAdmin ? handleEditDelegation : ()=>{}} onDelete={isAdmin ? handleDeleteDelegation : ()=>{}} onView={handleViewDelegation} />
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
      
      {isAdmin && <DelegationForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        delegation={editingDelegation || undefined}
        onSubmit={editingDelegation ? handleUpdateDelegation : handleCreateDelegation}
      />}
      {deleteConfirmationDialog}
    </div>
  );
};
