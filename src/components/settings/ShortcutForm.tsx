
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { NavigationShortcut, NavigationShortcutInput } from "@/hooks/useNavigationShortcuts";
import { ExternalLink, Globe, Mail, Phone, FileText, Users, Calendar } from "lucide-react";

interface ShortcutFormProps {
  shortcut?: NavigationShortcut;
  onSubmit: (data: NavigationShortcutInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const iconOptions = [
  { value: "external-link", label: "Enlace externo", icon: ExternalLink },
  { value: "globe", label: "Sitio web", icon: Globe },
  { value: "mail", label: "Email", icon: Mail },
  { value: "phone", label: "Teléfono", icon: Phone },
  { value: "file-text", label: "Documento", icon: FileText },
  { value: "users", label: "Usuarios", icon: Users },
  { value: "calendar", label: "Calendario", icon: Calendar },
];

export const ShortcutForm = ({ shortcut, onSubmit, onCancel, isLoading }: ShortcutFormProps) => {
  const [formData, setFormData] = useState<NavigationShortcutInput>({
    title: shortcut?.title || "",
    url: shortcut?.url || "",
    icon: shortcut?.icon || "external-link",
    order_position: shortcut?.order_position || 0,
    active: shortcut?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedIcon = iconOptions.find(option => option.value === formData.icon);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {shortcut ? "Editar Acceso Directo" : "Nuevo Acceso Directo"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nombre del acceso directo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icono</Label>
            <Select 
              value={formData.icon} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedIcon && (
                    <div className="flex items-center gap-2">
                      <selectedIcon.icon className="h-4 w-4" />
                      {selectedIcon.label}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              type="number"
              value={formData.order_position}
              onChange={(e) => setFormData(prev => ({ ...prev, order_position: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Activo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : shortcut ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
