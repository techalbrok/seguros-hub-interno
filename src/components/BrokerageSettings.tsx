
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Palette, Upload, Link, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ColorPicker } from "@/components/ColorPicker";
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

export const BrokerageSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<BrokerageConfig>({
    name: "Correduría de Seguros",
    address: "",
    phone: "",
    email: "",
    primary_color_light: "#1E2836",
    primary_color_dark: "#FFFFFF",
    accent_color_light: "#FF0000",
    accent_color_dark: "#FF4444",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brokerage_config')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig({
          id: data.id,
          name: data.name || "Correduría de Seguros",
          logo_url: data.logo_url,
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          primary_color_light: data.primary_color_light || "#1E2836",
          primary_color_dark: data.primary_color_dark || "#FFFFFF",
          accent_color_light: data.accent_color_light || "#FF0000",
          accent_color_dark: data.accent_color_dark || "#FF4444",
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const configData = {
        name: config.name,
        logo_url: config.logo_url,
        address: config.address,
        phone: config.phone,
        email: config.email,
        primary_color_light: config.primary_color_light,
        primary_color_dark: config.primary_color_dark,
        accent_color_light: config.accent_color_light,
        accent_color_dark: config.accent_color_dark,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (config.id) {
        result = await supabase
          .from('brokerage_config')
          .update(configData)
          .eq('id', config.id);
      } else {
        result = await supabase
          .from('brokerage_config')
          .insert([configData])
          .select()
          .single();
        
        if (result.data) {
          setConfig(prev => ({ ...prev, id: result.data.id }));
        }
      }

      if (result.error) throw result.error;

      toast({
        title: "Configuración guardada",
        description: "La configuración se ha actualizado correctamente",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: keyof BrokerageConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (url: string) => {
    updateConfig('logo_url', url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Navegación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Accesos Directos del Menú Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
                <p className="text-muted-foreground">
                  La gestión de accesos directos del menú principal estará disponible en una futura actualización.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="corporate-button"
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
};
