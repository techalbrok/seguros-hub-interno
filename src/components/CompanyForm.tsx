
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Company } from "@/types";

interface CompanyFormProps {
  company?: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    commercialWebsite?: string;
    brokerAccess: string;
    commercialManager: string;
    managerEmail: string;
  }) => void;
  isLoading?: boolean;
}

export const CompanyForm = ({ company, open, onOpenChange, onSubmit, isLoading }: CompanyFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    commercialWebsite: "",
    brokerAccess: "",
    commercialManager: "",
    managerEmail: "",
  });

  useEffect(() => {
    if (open) {
      if (company) {
        setFormData({
          name: company.name,
          commercialWebsite: company.commercialWebsite || "",
          brokerAccess: company.brokerAccess,
          commercialManager: company.commercialManager,
          managerEmail: company.managerEmail,
        });
      } else {
        setFormData({
          name: "",
          commercialWebsite: "",
          brokerAccess: "",
          commercialManager: "",
          managerEmail: "",
        });
      }
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {company ? "Editar Compañía" : "Nueva Compañía"}
          </DialogTitle>
          <DialogDescription>
            {company ? "Actualiza los detalles de la compañía." : "Añade una nueva compañía al sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : company ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
