'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, ArrowUpRight, X } from 'lucide-react';
import { useEffect } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-200 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          flex flex-col w-64 shrink-0
          border-r border-border/40 bg-[#0f0f13] text-zinc-100
          transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 text-white p-1 rounded">
              <LayoutGrid size={16} />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight leading-none">FORMA</div>
              <div className="text-[10px] text-zinc-400 font-medium tracking-widest mt-1">ADMIN PANEL</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">Admin User</div>
              <div className="text-xs text-zinc-400 truncate">admin@forma.com</div>
            </div>
          </div>
          
          <Link 
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors px-2"
          >
            <ArrowUpRight size={14} />
            View Storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
