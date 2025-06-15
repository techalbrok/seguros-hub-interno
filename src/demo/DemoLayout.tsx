
import React from 'react';
import { useLocation } from 'react-router-dom';
import { DemoSidebar } from './DemoSidebar';
import { DemoHeader } from './DemoHeader';
import { SidebarProvider } from "@/components/ui/sidebar";
import DemoProfile from './DemoProfile';

export const DemoLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/demo/profile';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DemoSidebar />
        <div className="flex-1 flex flex-col">
          <DemoHeader />
          <main className="flex-1 p-4 md:p-6 space-y-6">
            {isProfilePage ? <DemoProfile /> : children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
