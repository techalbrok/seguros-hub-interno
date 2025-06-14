
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid, List } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyCard } from "@/components/CompanyCard";
import { CompanyDetail } from "@/components/CompanyDetail";
import type { Company } from "@/types";

type ViewMode = "list" | "grid" | "detail" | "form";

export default function Companies() {
  const {
    companies,
    isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
  } = useCompanies();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.commercialManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.managerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCompany = (data: any) => {
    createCompany(data);
    setViewMode("grid");
  };

  const handleUpdateCompany = (data: any) => {
    if (editingCompany) {
      updateCompany({ ...data, id: editingCompany.id });
      setEditingCompany(null);
      setViewMode("grid");
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setViewMode("form");
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setViewMode("detail");
  };

  const handleDeleteCompany = (id: string) => {
    deleteCompany(id);
  };

  if (viewMode === "form") {
    return (
      <div className="container mx-auto py-6">
        <CompanyForm
          company={editingCompany || undefined}
          onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
          onCancel={() => {
            setEditingCompany(null);
            setViewMode("grid");
          }}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  if (viewMode === "detail" && selectedCompany) {
    return (
      <div className="container mx-auto py-6">
        <CompanyDetail
          company={selectedCompany}
          onEdit={handleEditCompany}
          onBack={() => {
            setSelectedCompany(null);
            setViewMode("grid");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
            Gestión de Compañías
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las compañías aseguradoras
          </p>
        </div>
        <Button onClick={() => setViewMode("form")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Compañía
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Compañías ({filteredCompanies.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar compañías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No se encontraron compañías que coincidan con la búsqueda"
                : "No hay compañías registradas"}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                  onView={handleViewCompany}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleViewCompany(company)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.commercialManager} • {company.managerEmail}
                        </p>
                        {company.commercialWebsite && (
                          <p className="text-xs text-blue-600 mt-1">{company.commercialWebsite}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCompany(company);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompany(company.id);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
