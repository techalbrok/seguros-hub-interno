
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building } from "lucide-react";
import { useDemoAuth } from "./DemoAuthContext";

interface DemoDelegation {
  id: string;
  name: string;
}
const DEMO_DELEGATIONS_KEY = "demo_delegations_list";
const demoDefaultDelegations: DemoDelegation[] = [
  { id: "1", name: "Central Demo" },
  { id: "2", name: "Sucursal Norte Demo" },
];

export const DemoDelegations = () => {
  const { user: authUser } = useDemoAuth();
  const [delegations, setDelegations] = useState<DemoDelegation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_DELEGATIONS_KEY);
    setDelegations(stored ? JSON.parse(stored) : demoDefaultDelegations);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_DELEGATIONS_KEY, JSON.stringify(delegations));
  }, [delegations]);

  const isAdmin = authUser?.role === 'admin';

  const addDelegation = () => {
    const name = prompt("Nombre de la delegación:");
    if (name) {
      setDelegations(d => [...d, { id: Math.random().toString(36).slice(2), name }]);
    }
  };

  const deleteDelegation = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta delegación?")) {
        setDelegations(d => d.filter(dl => dl.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sidebar-primary dark:text-white flex items-center gap-3">
            <Building className="h-7 w-7 sm:h-8 sm:w-8" />
            Gestión de Delegaciones (Demo)
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las delegaciones de la demo
          </p>
        </div>
        {isAdmin && (
            <Button onClick={addDelegation}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Delegación
            </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              {isAdmin && <TableHead className="text-right w-32">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {delegations.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteDelegation(d.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {delegations.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 2 : 1} className="text-center h-24">
                  No hay delegaciones demo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
