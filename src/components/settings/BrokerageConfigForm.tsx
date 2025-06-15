import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Palette, Link, BookText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBrokerageConfig, Terminology, defaultTerminology } from "@/hooks/useBrokerageConfig";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { AppearanceSettingsTab } from "./AppearanceSettingsTab";
import { NavigationSettingsTab } from "./NavigationSettingsTab";
import { TerminologySettingsTab } from "./TerminologySettingsTab";

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
  terminology: Terminology;
}

export const BrokerageConfigForm = () => {
  const { toast } = useToast();
  const { refreshConfig } = useBrokerageConfig();
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
    terminology: defaultTerminology,
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
          terminology: (data.terminology as Terminology) || defaultTerminology,
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
        terminology: config.terminology,
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

      refreshConfig();

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

  const updateConfig = (field: keyof BrokerageConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
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
        <TabsList className="grid w-full grid-cols-4">
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
            Accesos directos
          </TabsTrigger>
          <TabsTrigger value="terminology" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            Terminología
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettingsTab config={config} updateConfig={updateConfig} />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettingsTab config={config} updateConfig={updateConfig} />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <NavigationSettingsTab />
        </TabsContent>

        <TabsContent value="terminology" className="space-y-6">
          <TerminologySettingsTab
            terminology={config.terminology}
            onTerminologyChange={(newTerminology) => updateConfig('terminology', newTerminology)}
          />
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
