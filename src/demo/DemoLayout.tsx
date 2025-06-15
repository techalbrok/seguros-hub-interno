
import React from 'react';
import { DemoSidebar } from './DemoSidebar';
import { DemoHeader } from './DemoHeader';

export const DemoLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex w-full bg-background">
    <DemoSidebar />
    <div className="flex-1 flex flex-col">
      <DemoHeader />
      <main className="flex-1 p-4 md:p-6 space-y-6">{children}</main>
    </div>
  </div>
);
