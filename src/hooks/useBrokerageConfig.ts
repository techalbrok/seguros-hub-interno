import { useBrokerageConfigContext } from '@/contexts/BrokerageConfigContext';

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

export interface BrokerageConfig {
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
  return useBrokerageConfigContext();
};
