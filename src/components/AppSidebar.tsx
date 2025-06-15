
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
    const baseClass = "flex items-center w-full transition-all duration-300 ease-out relative group/nav-item";
    return isActive(path) 
      ? `${baseClass} text-sidebar-primary font-medium nav-item-active` 
      : `${baseClass} hover:text-sidebar-accent-foreground text-sidebar-foreground nav-item-inactive`;
  };

  const visibleNavigationItems = isAdmin
    ? navigationItems
    : navigationItems.filter(item => item.url !== '/settings');

  const renderMenuItems = () => {
    if (configLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <div className="flex items-center w-full h-12 px-3 nav-skeleton">
            <Skeleton className="h-5 w-5 rounded-sm shimmer" />
            {!collapsed && <Skeleton className="h-4 w-32 ml-3 shimmer" />}
          </div>
        </SidebarMenuItem>
      ));
    }

    return visibleNavigationItems.map((item, index) => (
      <SidebarMenuItem key={item.title} className="nav-item-wrapper">
        <SidebarMenuButton asChild className="h-12 nav-menu-button">
          <NavLink 
            to={item.url} 
            className={getNavClass(item.url)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="nav-icon-wrapper">
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0 transition-all duration-300`} />
            </div>
            {!collapsed && (
              <span className="nav-text truncate transition-all duration-300">
                {item.title}
              </span>
            )}
            <div className="nav-indicator" />
            <div className="nav-glow" />
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-sidebar-border sidebar-enhanced`} collapsible="icon">
      <div className={`flex items-center border-b border-sidebar-border/50 sidebar-header ${
          collapsed
          ? 'flex-col justify-center p-2 gap-2'
          : 'justify-between p-2 sm:p-4'
        }`}>
        {logoUrl ? (
          <RouterLink to="/" className="logo-wrapper">
            <img 
              src={logoUrl} 
              alt={`Logo de ${brokerageName}`} 
              className="h-8 w-8 object-contain transition-transform duration-300 hover:scale-110" 
            />
          </RouterLink>
        ) : (
          !collapsed && <div />
        )}
        <SidebarTrigger className="h-8 w-8 flex-shrink-0 sidebar-trigger" />
      </div>

      <SidebarContent className="px-2 py-2 sm:py-4 sidebar-content">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-1 sm:mb-2 sidebar-group-label">
            {!collapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 nav-menu">
              {renderMenuItems()}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavigationShortcuts />
      </SidebarContent>
    </Sidebar>
  );
}
