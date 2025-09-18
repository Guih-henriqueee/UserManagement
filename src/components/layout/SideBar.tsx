import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building,
  Monitor,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Usuários', href: '/usuarios', icon: Users },
  { name: 'Departamentos', href: '/departamentos', icon: Building },
  { name: 'Sistemas', href: '/sistemas', icon: Monitor },
  { name: 'Contratos', href: '/contratos', icon: FileText },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar-background/90 backdrop-blur-sm border-r border-sidebar-border/50 dark:bg-sidebar-background/90 dark:border-sidebar-border/50 transition-all duration-300",
        open || !collapsed ? "w-64" : "w-16",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border/50 dark:border-sidebar-border/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Monitor className="h-4 w-4 text-white" />
            </div>
            {(open || !collapsed) && (
              <span className="font-semibold text-lg text-gradient-brand truncate">
                SaaS Manager
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex h-8 w-8 p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 p-0"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group hover:shadow-brand-sm",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-primary border-l-2 border-primary"
                    : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent dark:text-sidebar-foreground dark:hover:text-sidebar-primary dark:hover:bg-sidebar-accent"
                )
              }
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                (open || !collapsed) ? "" : "mx-auto"
              )} />
              {(open || !collapsed) && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border/50 dark:border-sidebar-border/50 p-4">
          <div className={cn(
            "text-xs text-muted-foreground",
            (open || !collapsed) ? "text-center" : "sr-only"
          )}>
            v1.0.0
          </div>
        </div>
      </div>
    </>
  );
}