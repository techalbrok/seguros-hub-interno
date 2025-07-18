import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDelegations } from "@/hooks/useDelegations";
import { DelegationForm } from "@/components/DelegationForm";
import { DelegationDetail } from "@/components/DelegationDetail";
import { Delegation } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { DelegationImportDialog, CreateDelegationData } from "@/components/delegations/DelegationImportDialog";
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";
import { DelegationsPageHeader } from "@/components/delegations/DelegationsPageHeader";
import { DelegationsControls } from "@/components/delegations/DelegationsControls";
import { DelegationsGrid } from "@/components/delegations/DelegationsGrid";
import { DelegationsList } from "@/components/delegations/DelegationsList";
import { DelegationsEmptyState } from "@/components/delegations/DelegationsEmptyState";
import { DelegationsLoading } from "@/components/delegations/DelegationsLoading";
import { useAuth } from "@/hooks/useAuth";

const Delegations = () => {
  const { delegations, loading, createDelegation, updateDelegation, deleteDelegation } = useDelegations();
  const { permissions } = useAuth();
  const canCreateDelegations = permissions?.delegations?.canCreate ?? false;
  const canEditDelegations = permissions?.delegations?.canEdit ?? false;
  const canDeleteDelegations = permissions?.delegations?.canDelete ?? false;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [delegationToDelete, setDelegationToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  const filteredDelegations = delegations.filter(delegation =>
    delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingDelegation(null);
    setShowForm(true);
  };

  const handleEdit = (delegation: Delegation) => {
    setEditingDelegation(delegation);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleView = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setShowDetail(true);
  };

  const handleDelete = (delegationId: string) => {
    setDelegationToDelete(delegationId);
    setDeleteDialogOpen(true);
  };

  const handleBackFromDetail = () => {
    setSelectedDelegation(null);
    setShowDetail(false);
  };
  
  const confirmDelete = async () => {
    if (delegationToDelete) {
      await deleteDelegation(delegationToDelete);
      setDeleteDialogOpen(false);
      if (selectedDelegation?.id === delegationToDelete) {
        handleBackFromDetail();
      }
      setDelegationToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingDelegation) {
      return await updateDelegation(editingDelegation.id, data);
    } else {
      return await createDelegation(data);
    }
  };

  const handleBulkCreateDelegations = async (delegationsData: CreateDelegationData[]) => {
    const results = await Promise.allSettled(delegationsData.map(delegationData => createDelegation(delegationData)));
  
    const successfulCreations = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failedCreations = results.length - successfulCreations;
  
    toast({
      title: "Importación completada",
      description: `${successfulCreations} de ${delegationsData.length} ${t.plural.toLowerCase()} creadas exitosamente. ${failedCreations > 0 ? `Fallaron ${failedCreations}.` : ''}`,
      variant: failedCreations > 0 ? 'destructive' : 'default'
    });
  
    return { successfulCreations, failedCreations };
  };

  if (loading) {
    return <DelegationsLoading t={t} />;
  }

  if (showDetail && selectedDelegation) {
    return (
      <div className="space-y-6">
        <DelegationDetail
          delegation={selectedDelegation}
          onBack={handleBackFromDetail}
          onEdit={canEditDelegations ? (() => handleEdit(selectedDelegation)) : undefined}
          onDelete={canDeleteDelegations ? (() => handleDelete(selectedDelegation.id)) : undefined}
        />
        <DelegationForm
          delegation={editingDelegation}
          open={showForm}
          onOpenChange={setShowForm}
          onSubmit={handleFormSubmit}
        />
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar {t.singular.toLowerCase()}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La {t.singular.toLowerCase()} será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DelegationsPageHeader 
        t={t} 
        onImportClick={canCreateDelegations ? () => setIsImportDialogOpen(true) : undefined}
        onCreateClick={canCreateDelegations ? handleCreate : undefined}
      />

      <Card>
        <CardHeader>
          <DelegationsControls
            t={t}
            filteredCount={filteredDelegations.length}
            totalCount={delegations.length}
            viewMode={viewMode}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onViewModeChange={setViewMode}
          />
        </CardHeader>
        <CardContent>
          {filteredDelegations.length === 0 ? (
            <DelegationsEmptyState
              t={t}
              hasSearchTerm={!!searchTerm}
              onCreateClick={canCreateDelegations ? handleCreate : undefined}
            />
          ) : (
            viewMode === 'grid' ? (
              <DelegationsGrid 
                delegations={filteredDelegations}
                onEdit={canEditDelegations ? handleEdit : undefined}
                onDelete={canDeleteDelegations ? handleDelete : undefined}
                onView={handleView}
              />
            ) : (
              <DelegationsList 
                delegations={filteredDelegations}
                onEdit={canEditDelegations ? handleEdit : undefined}
                onDelete={canDeleteDelegations ? handleDelete : undefined}
                onView={handleView}
              />
            )
          )}
        </CardContent>
      </Card>

      <DelegationForm
        delegation={editingDelegation}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {t.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La {t.singular.toLowerCase()} será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <DelegationImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onBulkCreate={handleBulkCreateDelegations}
      />
    </div>
  );
};

export default Delegations;
