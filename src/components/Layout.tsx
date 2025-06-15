
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { DemoBanner } from "./DemoBanner";
import { SystemAlerts } from "./SystemAlerts";

interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({
  children
}: LayoutProps) => {
  const isDemo = window.location.pathname.startsWith('/demo');
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          {isDemo && <DemoBanner />}
          <main className="flex-1 p-6 space-y-6 animate-fade-in">
            <div className="absolute top-20 right-6 w-full max-w-md z-50">
                <SystemAlerts />
            </div>
            <AppBreadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
