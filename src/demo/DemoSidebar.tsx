
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Users, Calendar, Newspaper, Briefcase, Building, Building2, Package } from "lucide-react";
import { DemoNavigationShortcuts } from "./DemoNavigationShortcuts";

const navItems = [
  { to: "/demo/dashboard", label: "Dashboard", icon: Calendar },
  { to: "/demo/users", label: "Usuarios", icon: Users },
  { to: "/demo/delegations", label: "Delegaciones", icon: Building },
  { to: "/demo/companies", label: "Compañías", icon: Building2 },
  { to: "/demo/products", label: "Productos", icon: Package },
  { to: "/demo/departments", label: "Departamentos", icon: Briefcase },
  { to: "/demo/news", label: "Noticias", icon: Newspaper },
];

export const DemoSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center w-full transition-all duration-300 ease-out relative group/nav-item";
    return isActive(path) 
      ? `${baseClass} text-sidebar-primary font-medium nav-item-active` 
      : `${baseClass} hover:text-sidebar-accent-foreground text-sidebar-foreground nav-item-inactive`;
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-sidebar-border sidebar-enhanced hidden sm:flex`} collapsible="icon">
      <div className={`flex items-center border-b border-sidebar-border/50 sidebar-header ${
          collapsed
          ? 'justify-center p-2'
          : 'justify-between p-4'
        }`}>
        {!collapsed && <div className="font-bold text-lg">Demo</div>}
        <SidebarTrigger className="h-8 w-8 flex-shrink-0 sidebar-trigger" />
      </div>

      <SidebarContent className="px-2 py-2 sm:py-4 sidebar-content">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-1 sm:mb-2 sidebar-group-label">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 nav-menu">
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.to} className="nav-item-wrapper">
                  <SidebarMenuButton asChild className="h-12 nav-menu-button">
                    <NavLink 
                      to={item.to} 
                      className={getNavClass(item.to)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="nav-icon-wrapper">
                        <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0 transition-all duration-300`} />
                      </div>
                      {!collapsed && (
                        <span className="nav-text truncate transition-all duration-300">
                          {item.label}
                        </span>
                      )}
                      <div className="nav-indicator" />
                      <div className="nav-glow" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <DemoNavigationShortcuts />
      </SidebarContent>
    </Sidebar>
  );
};
