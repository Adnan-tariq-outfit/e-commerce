'use client';

import { Menu, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/theme/provider';

interface AdminHeaderProps {
  setIsSidebarOpen: (value: boolean) => void;
}

export function AdminHeader({ setIsSidebarOpen }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();

  const themeOrder = ["light", "dark", "system"] as const;
  const cycleTheme = () => {
    const next = themeOrder[(themeOrder.indexOf(theme as (typeof themeOrder)[number]) + 1) % themeOrder.length];
    setTheme(next);
  };
  const ThemeIcon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;
  const themeTitle = theme === "light" ? "Switch to dark" : theme === "dark" ? "Switch to system" : "Switch to light";
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border/40 bg-background sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold tracking-tight hidden sm:block">Dashboard</h1>
          <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Overview of your store performance</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={cycleTheme}
          title={themeTitle}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ThemeIcon size={16} />
          <span className="sr-only">Toggle theme</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium border border-green-500/20 whitespace-nowrap">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
          <span className="hidden sm:inline">All systems operational</span>
          <span className="sm:hidden">Operational</span>
        </div>
      </div>
    </header>
  );
}
