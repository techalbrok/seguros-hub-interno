
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import { SimpleImageUpload } from "@/components/SimpleImageUpload";

interface BrokerageConfig {
  id?: string;
  name: string;
  logo_url?: string;
  address: string;
  phone: string;
  email: string;
  primary_color_light: string;
  primary_color_dark: string;
  accent_color_light: string;
  accent_color_dark: string;
}

interface GeneralSettingsTabProps {
  config: BrokerageConfig;
  updateConfig: (field: keyof BrokerageConfig, value: string) => void;
}

export const GeneralSettingsTab = ({ config, updateConfig }: GeneralSettingsTabProps) => {
  const handleLogoUpload = (url: string) => {
    updateConfig('logo_url', url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Información General de la Correduría
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Correduría</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => updateConfig('name', e.target.value)}
                placeholder="Nombre de la correduría"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input
                id="email"
                type="email"
                value={config.email}
                onChange={(e) => updateConfig('email', e.target.value)}
                placeholder="contacto@correduriaseguros.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={config.phone}
                onChange={(e) => updateConfig('phone', e.target.value)}
                placeholder="+34 900 000 000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={config.address}
                onChange={(e) => updateConfig('address', e.target.value)}
                placeholder="Dirección completa de la correduría"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Logotipo</Label>
              <SimpleImageUpload
                onUpload={handleLogoUpload}
                currentImage={config.logo_url}
                accept="image/*"
                placeholder="Subir logotipo de la correduría"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
