
import { Globe } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const demoShortcuts = [
  { id: '1', title: 'Google', url: 'https://google.com' },
  { id: '2', title: 'Yahoo', url: 'https://yahoo.com' },
  { id: '3', title: 'Microsoft', url: 'https://microsoft.com' },
];

export const DemoNavigationShortcuts = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2 sidebar-group-label">
        {!collapsed && "Accesos Directos"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 nav-menu">
          {demoShortcuts.map((shortcut, index) => {
            const IconComponent = Globe;
            
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
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
