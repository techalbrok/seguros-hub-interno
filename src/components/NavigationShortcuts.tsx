
import { ExternalLink, Globe, Mail, Phone, FileText, Users, Calendar } from "lucide-react";
import { useNavigationShortcuts } from "@/hooks/useNavigationShortcuts";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

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
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2">
        {!collapsed && "Accesos Directos"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {activeShortcuts.map((shortcut) => {
            const IconComponent = getIcon(shortcut.icon || "external-link");
            
            return (
              <SidebarMenuItem key={shortcut.id}>
                <SidebarMenuButton asChild className="h-10">
                  <a 
                    href={shortcut.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center w-full transition-colors duration-200 hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  >
                    <IconComponent className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                    {!collapsed && <span className="truncate">{shortcut.title}</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
