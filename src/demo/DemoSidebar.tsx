
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Users, Calendar, Newspaper, Briefcase, Building, Building2, Package } from "lucide-react";

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
    const baseClass = "flex items-center w-full transition-colors duration-200";
    return isActive(path) 
      ? `${baseClass} bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-primary` 
      : `${baseClass} hover:bg-sidebar-accent/50 text-sidebar-foreground`;
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-sidebar-border hidden sm:flex`} collapsible="icon">
      <div className={`flex items-center border-b border-sidebar-border ${
          collapsed
          ? 'justify-center p-2'
          : 'justify-between p-4'
        }`}>
        {!collapsed && <div className="font-bold text-lg">Demo</div>}
        <SidebarTrigger className="h-8 w-8 flex-shrink-0" />
      </div>

      <SidebarContent className="px-2 py-2 sm:py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-1 sm:mb-2">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map(item => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.to} className={getNavClass(item.to)}>
                      <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
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
};
