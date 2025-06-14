
import { useState } from "react";
import { Users, User, Calendar, Bell, Newspaper, Edit, Image, Video, Link } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Calendar },
  { title: "Usuarios", url: "/users", icon: Users },
  { title: "Delegaciones", url: "/delegations", icon: User },
  { title: "Compañías", url: "/companies", icon: Link },
  { title: "Productos", url: "/products", icon: Edit },
  { title: "Departamentos", url: "/department-content", icon: Image },
  { title: "Noticias", url: "/news", icon: Newspaper },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const isExpanded = navigationItems.some((item) => isActive(item.url));

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center w-full transition-colors duration-200";
    return isActive(path)
      ? `${baseClass} bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-primary`
      : `${baseClass} hover:bg-sidebar-accent/50 text-sidebar-foreground`;
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-sidebar-border`}
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-bold text-sidebar-primary dark:text-white">Correduría Seguros</span>
          </div>
        )}
        <SidebarTrigger className="h-8 w-8" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2">
            {!collapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
