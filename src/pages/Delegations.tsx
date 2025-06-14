
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDelegations } from "@/hooks/useDelegations";
import { DelegationForm } from "@/components/DelegationForm";
import { DelegationDetail } from "@/components/DelegationDetail";
import { DelegationCard } from "@/components/DelegationCard";
import { Delegation } from "@/types";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const Delegations = () => {
  const { delegations, loading, createDelegation, updateDelegation, deleteDelegation } = useDelegations();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [delegationToDelete, setDelegationToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const confirmDelete = async () => {
    if (delegationToDelete) {
      await deleteDelegation(delegationToDelete);
      setDeleteDialogOpen(false);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white">
            Gestión de Delegaciones
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDelegations.map((delegation) => (
        <DelegationCard
          key={delegation.id}
          delegation={delegation}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredDelegations.map((delegation) => (
        <Card key={delegation.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sidebar-primary dark:text-white">
                    {delegation.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{delegation.legalName}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{delegation.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{delegation.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{delegation.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleView(delegation)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(delegation)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(delegation.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white">
            Gestión de Delegaciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona las delegaciones y su información
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Delegación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>Delegaciones</span>
              <Badge variant="secondary">
                {filteredDelegations.length} de {delegations.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar delegaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredDelegations.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sidebar-primary dark:text-white mb-2">
                {searchTerm ? "No se encontraron delegaciones" : "No hay delegaciones"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primera delegación"
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Delegación
                </Button>
              )}
            </div>
          ) : (
            <div>
              {viewMode === 'grid' ? renderGridView() : renderListView()}
            </div>
          )}
        </CardContent>
      </Card>

      <DelegationForm
        delegation={editingDelegation}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
      />

      <DelegationDetail
        delegation={selectedDelegation}
        open={showDetail}
        onOpenChange={setShowDetail}
        onEdit={() => handleEdit(selectedDelegation!)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar delegación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La delegación será eliminada permanentemente.
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
};

export default Delegations;
