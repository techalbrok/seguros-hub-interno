
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BrokerageConfig, Terminology, defaultTerminology } from '@/hooks/useBrokerageConfig';

interface BrokerageConfigContextType {
  config: BrokerageConfig | null;
  loading: boolean;
  refreshConfig: () => void;
}

const BrokerageConfigContext = createContext<BrokerageConfigContextType | undefined>(undefined);

export const BrokerageConfigProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<BrokerageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
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
      } else {
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
  }, [toast]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const value = { config, loading, refreshConfig: fetchConfig };

  return (
    <BrokerageConfigContext.Provider value={value}>
      {children}
    </BrokerageConfigContext.Provider>
  );
};

export const useBrokerageConfigContext = () => {
  const context = useContext(BrokerageConfigContext);
  if (context === undefined) {
    throw new Error('useBrokerageConfigContext must be used within a BrokerageConfigProvider');
  }
  return context;
};

