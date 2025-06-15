
import { useState, useEffect } from "react";
import { Department } from "@/hooks/useDepartments";
import { DepartmentCard } from "@/components/DepartmentCard";
import { DepartmentForm } from "@/components/DepartmentForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Grid, List, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const DEMO_DEPARTMENTS_KEY = "demo_departments_list";

const demoDefaultDepartments: Department[] = [
  { 
    id: "1", 
    name: "Departamento Comercial Demo",
    responsible_name: "Juan Demo",
    responsible_email: "comercial@demo.com",
    description: "Gestión de clientes y ventas.",
    created_at: new Date(),
    updated_at: new Date(),
  },
  { 
    id: "2", 
    name: "Departamento Siniestros Demo",
    responsible_name: "Ana Demo",
    responsible_email: "siniestros@demo.com",
    description: "Tramitación de partes y siniestros.",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const DemoDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(DEMO_DEPARTMENTS_KEY);
      const initialDepartments = stored 
        ? JSON.parse(stored).map((d: any) => ({ ...d, created_at: new Date(d.created_at), updated_at: new Date(d.updated_at) }))
        : demoDefaultDepartments;
      setDepartments(initialDepartments);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DEMO_DEPARTMENTS_KEY, JSON.stringify(departments));
    }
  }, [departments, isLoading]);

  const handleAddNew = () => {
    setEditingDepartment(null);
    setShowForm(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const dept = departments.find(d => d.id === id);
    if (dept) {
        setDepartmentToDelete(dept);
    }
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      setDepartments(d => d.filter(dp => dp.id !== departmentToDelete.id));
      setDepartmentToDelete(null);
    }
  };
  
  const onFormOpenChange = (isOpen: boolean) => {
    setShowForm(isOpen);
    if (!isOpen) {
      setEditingDepartment(null);
    }
  }

  const handleFormSubmit = async (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (editingDepartment) {
      const updatedDepartment: Department = {
        ...editingDepartment,
        ...data,
        updated_at: new Date(),
      };
      setDepartments(d => d.map(dep => (dep.id === editingDepartment.id ? updatedDepartment : dep)));
    } else {
      const newDepartment: Department = {
        id: Math.random().toString(36).slice(2),
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setDepartments(d => [newDepartment, ...d]);
    }
    return true;
  };
  
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-10 w-44" />
              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64" />)}
                </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departamentos Demo</h1>
        <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Departamento
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto sm:flex-1 sm:max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
        {filteredDepartments.length > 0 ? (
          viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDepartments.map((department) => (
                      <DepartmentCard
                          key={department.id}
                          department={department}
                          onEdit={() => handleEdit(department)}
                          onDelete={() => handleDelete(department.id)}
                          onViewContent={() => alert("Ver contenido no disponible en la demo.")}
                          contentCount={0}
                      />
                  ))}
              </div>
            ) : (
                <div className="border rounded-md">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr className="border-b">
                                <th className="p-4 text-left font-semibold">Nombre</th>
                                <th className="p-4 text-left font-semibold hidden md:table-cell">Responsable</th>
                                <th className="p-4 text-left font-semibold hidden lg:table-cell">Email</th>
                                <th className="p-4 w-28"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map(d => (
                                <tr key={d.id} className="border-b last:border-b-0 hover:bg-muted/50">
                                    <td className="p-4 font-medium">{d.name}</td>
                                    <td className="p-4 hidden md:table-cell">{d.responsible_name}</td>
                                    <td className="p-4 hidden lg:table-cell">{d.responsible_email}</td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(d)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
          ) : (
           <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchTerm
                ? "No se encontraron departamentos"
                : "Aún no hay departamentos"}
            </p>
            {!searchTerm && 
                <Button onClick={handleAddNew} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primer departamento
                </Button>
            }
          </div>
        )}
        </CardContent>
      </Card>

      <DepartmentForm
        open={showForm}
        onOpenChange={onFormOpenChange}
        department={editingDepartment || undefined}
        onSubmit={handleFormSubmit}
      />
      
      <AlertDialog open={!!departmentToDelete} onOpenChange={(open) => !open && setDepartmentToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción eliminará permanentemente el departamento{' '}
                <span className="font-semibold">{departmentToDelete?.name}</span>. No se puede deshacer.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
                onClick={confirmDelete}
                variant="destructive"
            >
                Sí, eliminar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
