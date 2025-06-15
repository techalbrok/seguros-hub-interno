
import { ExternalLink, Globe, Mail, Phone, FileText, Users, Calendar } from "lucide-react";
import { useNavigationShortcuts } from "@/hooks/useNavigationShortcuts";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const getIcon = (iconName: string) => {
  const icons = {
    "external-link": ExternalLink,
    "globe": Globe,
    "mail": Mail,
    "phone": Phone,
    "file-text": FileText,
    "users": Users,
    "calendar": Calendar,
  };
  return icons[iconName as keyof typeof icons] || ExternalLink;
};

/**
 * Returns true if the url is external (starts with http/https), otherwise internal.
 */
const isExternal = (url: string) => /^https?:\/\//i.test(url);

export const NavigationShortcuts = () => {
  const { shortcuts, loading } = useNavigationShortcuts();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const activeShortcuts = shortcuts.filter(shortcut => shortcut.active);

  if (loading || activeShortcuts.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2 sidebar-group-label">
        {!collapsed && "Accesos Directos"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 nav-menu">
          {activeShortcuts.map((shortcut, index) => {
            const IconComponent = getIcon(shortcut.icon || "external-link");

            if (isExternal(shortcut.url)) {
              // Enlace externo (abre en nueva pestaña)
              return (
                <SidebarMenuItem key={shortcut.id} className="nav-item-wrapper">
                  <SidebarMenuButton asChild className="h-12 nav-menu-button">
                    <a 
                      href={shortcut.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full transition-all duration-300 ease-out relative group/nav-item hover:text-sidebar-accent-foreground text-sidebar-foreground nav-item-inactive"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="nav-icon-wrapper">
                        <IconComponent className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0 transition-all duration-300`} />
                      </div>
                      {!collapsed && (
                        <span className="nav-text truncate transition-all duration-300">
                          {shortcut.title}
                        </span>
                      )}
                      <div className="nav-indicator" />
                      <div className="nav-glow" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            } else {
              // Enlace interno (SPA navigation)
              return (
                <SidebarMenuItem key={shortcut.id} className="nav-item-wrapper">
                  <SidebarMenuButton asChild className="h-12 nav-menu-button">
                    <Link 
                      to={shortcut.url}
                      className="flex items-center w-full transition-all duration-300 ease-out relative group/nav-item hover:text-sidebar-accent-foreground text-sidebar-foreground nav-item-inactive"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="nav-icon-wrapper">
                        <IconComponent className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0 transition-all duration-300`} />
                      </div>
                      {!collapsed && (
                        <span className="nav-text truncate transition-all duration-300">
                          {shortcut.title}
                        </span>
                      )}
                      <div className="nav-indicator" />
                      <div className="nav-glow" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
