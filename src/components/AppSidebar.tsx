import { NavLink, useLocation, Link as RouterLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NavigationShortcuts } from "@/components/NavigationShortcuts";
import { useBrokerageConfig, defaultTerminology } from "@/hooks/useBrokerageConfig";
import { useAuth } from "@/hooks/useAuth";
import { getNavigationItems } from "./navigationItems";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { config, loading: configLoading } = useBrokerageConfig();
  const { isAdmin } = useAuth();
  const logoUrl = config?.logo_url;
  const brokerageName = config?.name || "Intranet Correduría";

  const terminology = config?.terminology || defaultTerminology;
  const navigationItems = getNavigationItems(terminology);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center w-full transition-colors duration-200";
    return isActive(path) 
      ? `${baseClass} bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-primary` 
      : `${baseClass} hover:bg-sidebar-accent/50 text-sidebar-foreground`;
  };

  const visibleNavigationItems = isAdmin
    ? navigationItems
    : navigationItems.filter(item => item.url !== '/settings');

  const renderMenuItems = () => {
    if (configLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <div className="flex items-center w-full h-10 px-3">
            <Skeleton className="h-5 w-5 rounded-sm" />
            {!collapsed && <Skeleton className="h-4 w-32 ml-3" />}
          </div>
        </SidebarMenuItem>
      ));
    }

    return visibleNavigationItems.map(item => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className="h-10">
          <NavLink to={item.url} className={getNavClass(item.url)}>
            <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-sidebar-border`} collapsible="icon">
      <div className={`flex items-center border-b border-sidebar-border ${
          collapsed
          ? 'flex-col justify-center p-2 gap-2'
          : 'justify-between p-4'
        }`}>
        {logoUrl ? (
          <RouterLink to="/">
            <img src={logoUrl} alt={`Logo de ${brokerageName}`} className="h-8 w-8 object-contain" />
          </RouterLink>
        ) : (
          !collapsed && <div />
        )}
        <SidebarTrigger className="h-8 w-8 flex-shrink-0" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2">
            {!collapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems()}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavigationShortcuts />
      </SidebarContent>
    </Sidebar>
  );
}
