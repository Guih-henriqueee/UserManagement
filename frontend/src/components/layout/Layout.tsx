import { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-to-br dark:from-background dark:via-secondary/10 dark:to-primary/5">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-16"
      )}>
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}