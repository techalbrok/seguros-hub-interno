
import { Users, User, Calendar, Bell, Newspaper, Edit, Image, Video, Link, Settings } from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Calendar
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: Users
  },
  {
    title: "Delegaciones",
    url: "/delegations",
    icon: User
  },
  {
    title: "Compañías",
    url: "/companies",
    icon: Link
  },
  {
    title: "Productos",
    url: "/products",
    icon: Edit
  },
  {
    title: "Departamentos",
    url: "/department-content",
    icon: Image
  },
  {
    title: "Noticias",
    url: "/news",
    icon: Newspaper
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings
  }
];
