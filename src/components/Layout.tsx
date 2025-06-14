
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({
  children
}: LayoutProps) => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 space-y-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
