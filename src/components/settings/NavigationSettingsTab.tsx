
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import { useNavigationShortcuts } from "@/hooks/useNavigationShortcuts";
import { ShortcutForm } from "./ShortcutForm";
import { ShortcutsList } from "./ShortcutsList";
import type { NavigationShortcut } from "@/hooks/useNavigationShortcuts";

export const NavigationSettingsTab = () => {
  const { shortcuts, loading, creating, updating, createShortcut, updateShortcut, deleteShortcut } = useNavigationShortcuts();
  const [showForm, setShowForm] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<NavigationShortcut | null>(null);

  const handleCreateShortcut = async (data: any) => {
    await createShortcut(data);
    setShowForm(false);
  };

  const handleUpdateShortcut = async (data: any) => {
    if (editingShortcut) {
      await updateShortcut(editingShortcut.id, data);
      setEditingShortcut(null);
      setShowForm(false);
    }
  };

  const handleEdit = (shortcut: NavigationShortcut) => {
    setEditingShortcut(shortcut);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingShortcut(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando accesos directos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <ShortcutForm
        shortcut={editingShortcut || undefined}
        onSubmit={editingShortcut ? handleUpdateShortcut : handleCreateShortcut}
        onCancel={handleCancel}
        isLoading={creating || updating}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Accesos Directos del Menú Principal
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona los enlaces externos que aparecen debajo de la navegación principal
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Acceso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ShortcutsList 
            shortcuts={shortcuts}
            onEdit={handleEdit}
            onDelete={deleteShortcut}
          />
        </CardContent>
      </Card>
    </div>
  );
};
