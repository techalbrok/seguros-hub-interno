
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
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-2 mb-2">
        {!collapsed && "Accesos Directos"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {demoShortcuts.map((shortcut) => {
            const IconComponent = Globe;
            
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

