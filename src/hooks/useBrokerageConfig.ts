
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Terminology {
  [key: string]: {
    singular: string;
    plural: string;
  };
}

export const defaultTerminology: Terminology = {
  dashboard: { singular: "Dashboard", plural: "Dashboard" },
  user: { singular: "Usuario", plural: "Usuarios" },
  delegation: { singular: "Delegación", plural: "Delegaciones" },
  company: { singular: "Compañía", plural: "Compañías" },
  product: { singular: "Producto", plural: "Productos" },
  department: { singular: "Departamento", plural: "Departamentos" },
  news: { singular: "Noticia", plural: "Noticias" },
  settings: { singular: "Configuración", plural: "Configuración" },
};

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

export const useBrokerageConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<BrokerageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
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
          terminology: data.terminology as Terminology || defaultTerminology,
        });
      } else {
        // Si no hay configuración, usar valores por defecto
        setConfig({
          name: "Intranet Correduría",
          address: "",
          phone: "",
          email: "",
          primary_color_light: "#1E2836",
          primary_color_dark: "#FFFFFF",
          accent_color_light: "#FF0000",
          accent_color_dark: "#FF4444",
          terminology: defaultTerminology,
        });
      }
    } catch (error) {
      console.error('Error fetching brokerage config:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de la correduría",
        variant: "destructive",
      });
      // En caso de error, usar valores por defecto
      setConfig({
        name: "Intranet Correduría",
        address: "",
        phone: "",
        email: "",
        primary_color_light: "#1E2836",
        primary_color_dark: "#FFFFFF",
        accent_color_light: "#FF0000",
        accent_color_dark: "#FF4444",
        terminology: defaultTerminology,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Función para refrescar la configuración cuando se actualice
  const refreshConfig = () => {
    fetchConfig();
  };

  return { 
    config, 
    loading, 
    refreshConfig 
  };
};
