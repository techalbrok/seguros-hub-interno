
import { Users, User, Calendar, Newspaper, Edit, Link, Settings, Briefcase, Building, Building2, Package } from "lucide-react";
import { Terminology } from "@/hooks/useBrokerageConfig";

export const getNavigationItems = (terminology: Terminology) => [
  {
    title: terminology.dashboard?.singular || "Dashboard",
    url: "/",
    icon: Calendar
  },
  {
    title: terminology.user?.plural || "Usuarios",
    url: "/users",
    icon: Users
  },
  {
    title: terminology.delegation?.plural || "Delegaciones",
    url: "/delegations",
    icon: Building
  },
  {
    title: terminology.company?.plural || "Compañías",
    url: "/companies",
    icon: Building2
  },
  {
    title: terminology.product?.plural || "Productos",
    url: "/products",
    icon: Package
  },
  {
    title: terminology.department?.plural || "Departamentos",
    url: "/departments",
    icon: Briefcase
  },
  {
    title: terminology.news?.plural || "Noticias",
    url: "/news",
    icon: Newspaper
  },
  {
    title: terminology.settings?.plural || "Configuración",
    url: "/settings",
    icon: Settings
  }
];
