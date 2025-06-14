
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { ColorPicker } from "@/components/ColorPicker";

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

interface AppearanceSettingsTabProps {
  config: BrokerageConfig;
  updateConfig: (field: keyof BrokerageConfig, value: string) => void;
}

export const AppearanceSettingsTab = ({ config, updateConfig }: AppearanceSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Colores de Acento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Modo Claro</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Color Primario (Encabezados)</Label>
                <ColorPicker
                  color={config.primary_color_light}
                  onChange={(color) => updateConfig('primary_color_light', color)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color de Acento (Botones)</Label>
                <ColorPicker
                  color={config.accent_color_light}
                  onChange={(color) => updateConfig('accent_color_light', color)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Modo Oscuro</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Color Primario (Encabezados)</Label>
                <ColorPicker
                  color={config.primary_color_dark}
                  onChange={(color) => updateConfig('primary_color_dark', color)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color de Acento (Botones)</Label>
                <ColorPicker
                  color={config.accent_color_dark}
                  onChange={(color) => updateConfig('accent_color_dark', color)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
