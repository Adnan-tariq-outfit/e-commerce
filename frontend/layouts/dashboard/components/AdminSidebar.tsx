'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, ArrowUpRight, X, Tag } from 'lucide-react';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getImageUrl } from '@/utils/getImageUrl';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD';

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: Tag },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          flex flex-col w-64 shrink-0
          border-r border-border bg-card text-foreground
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <LayoutGrid size={16} />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight leading-none text-foreground">FORMA</div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest mt-0.5">ADMIN PANEL</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-5 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-primary' : ''} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + storefront link */}
        <div className="p-4 border-t border-border shrink-0 space-y-3">
          <div className="flex items-center gap-3 px-1">
            {user?.avatar_url ? (
              <img
                src={getImageUrl(user.avatar_url)}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary via-orange-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {user?.name ?? 'Admin'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.email ?? ''}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          >
            <ArrowUpRight size={13} />
            View Storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
