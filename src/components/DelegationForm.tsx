import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Delegation } from "@/types";
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";

interface DelegationFormProps {
  delegation?: Delegation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    legalName: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    contactPerson: string;
  }) => Promise<boolean>;
}

export const DelegationForm = ({ delegation, open, onOpenChange, onSubmit }: DelegationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    contactPerson: "",
  });
  const [loading, setLoading] = useState(false);
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  useEffect(() => {
    if (delegation) {
      setFormData({
        name: delegation.name,
        legalName: delegation.legalName,
        address: delegation.address,
        phone: delegation.phone,
        email: delegation.email,
        website: delegation.website || "",
        contactPerson: delegation.contactPerson,
      });
    } else {
      setFormData({
        name: "",
        legalName: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        contactPerson: "",
      });
    }
  }, [delegation, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onSubmit({
      name: formData.name,
      legalName: formData.legalName,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      website: formData.website || undefined,
      contactPerson: formData.contactPerson,
    });

    if (success) {
      onOpenChange(false);
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {delegation ? `Editar ${t.singular}` : `Nueva ${t.singular}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={`Nombre de la ${t.singular.toLowerCase()}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">Razón Social *</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(e) => handleInputChange("legalName", e.target.value)}
                placeholder="Razón social"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Dirección completa"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Número de teléfono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Correo electrónico"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Persona de Contacto *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                placeholder="Nombre del contacto"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : delegation ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
