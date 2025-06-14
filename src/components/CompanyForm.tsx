
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company } from "@/types";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: {
    name: string;
    commercialWebsite?: string;
    brokerAccess: string;
    commercialManager: string;
    managerEmail: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CompanyForm = ({ company, onSubmit, onCancel, isLoading }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    commercialWebsite: company?.commercialWebsite || "",
    brokerAccess: company?.brokerAccess || "",
    commercialManager: company?.commercialManager || "",
    managerEmail: company?.managerEmail || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {company ? "Editar Compañía" : "Nueva Compañía"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Nombre de la compañía"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commercialWebsite">Web Comercial</Label>
              <Input
                id="commercialWebsite"
                type="url"
                value={formData.commercialWebsite}
                onChange={(e) => handleChange("commercialWebsite", e.target.value)}
                placeholder="https://www.ejemplo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brokerAccess">Acceso a Corredores *</Label>
            <Input
              id="brokerAccess"
              value={formData.brokerAccess}
              onChange={(e) => handleChange("brokerAccess", e.target.value)}
              required
              placeholder="URL o información de acceso para corredores"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commercialManager">Responsable Comercial *</Label>
              <Input
                id="commercialManager"
                value={formData.commercialManager}
                onChange={(e) => handleChange("commercialManager", e.target.value)}
                required
                placeholder="Nombre del responsable comercial"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="managerEmail">Email del Responsable *</Label>
              <Input
                id="managerEmail"
                type="email"
                value={formData.managerEmail}
                onChange={(e) => handleChange("managerEmail", e.target.value)}
                required
                placeholder="email@ejemplo.com"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : company ? "Actualizar" : "Crear"}
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
