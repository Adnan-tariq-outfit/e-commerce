'use client';

import Link from 'next/link';
import { Moon, Sun, Monitor, ShoppingBag, ArrowUpRight, LayoutGrid, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/theme/provider';
import { useAppSelector } from '@/store/hooks';
import { getImageUrl } from '@/utils/getImageUrl';
import ProfileDropdown from '@/components/profile-dropdown/ProfileDropdown';
import { useGetCategoriesQuery } from '@/services/category/categoryApi';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: categories } = useGetCategoriesQuery();

  const themeOrder = ["light", "dark", "system"] as const;
  const cycleTheme = () => {
    const next = themeOrder[(themeOrder.indexOf(theme as (typeof themeOrder)[number]) + 1) % themeOrder.length];
    setTheme(next);
  };
  const ThemeIcon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;
  const themeTitle = theme === "light" ? "Switch to dark" : theme === "dark" ? "Switch to system" : "Switch to light";

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : '??';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md hidden sm:block">
                <LayoutGrid size={20} />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight">FORMA</span>
            </Link>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
            <Link href="/products" className="transition-colors hover:text-foreground">Shop All</Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="transition-colors hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              title={themeTitle}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ThemeIcon size={18} />
              <span className="sr-only">Toggle theme</span>
            </button>

            {/* Cart */}
            <button className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors relative">
              <ShoppingBag size={18} />
              <span className="sr-only">Cart</span>
            </button>

            {isAuthenticated ? (
              /* Avatar button — authenticated */
              <button
                onClick={() => setIsDropdownOpen(true)}
                className="relative ml-0.5 focus:outline-none"
              >
                {user?.avatar_url ? (
                  <img
                    src={getImageUrl(user.avatar_url)}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/40 hover:ring-primary/70 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-600 flex items-center justify-center shadow-md ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                )}
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
              </button>
            ) : (
              /* Sign in + Admin — unauthenticated */
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  className="hidden lg:inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground gap-1"
                >
                  Admin <ArrowUpRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background absolute w-full left-0 shadow-lg">
            <nav className="flex flex-col p-4 text-sm font-medium gap-4">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-foreground text-muted-foreground block py-1">Shop All</Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="transition-colors hover:text-foreground text-muted-foreground block py-1"
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="border-border/40" />
              {isAuthenticated ? (
                <>
                  <p className="text-foreground font-semibold py-1">{user?.name}</p>
                  {user?.role === 'ADMIN' && (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1 py-1">
                      Admin Panel <ArrowUpRight size={14} />
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsDropdownOpen(true); }}
                    className="text-left text-primary font-semibold py-1"
                  >
                    View profile & sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors text-primary font-semibold block py-1">Sign in</Link>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-foreground text-muted-foreground flex items-center gap-1 py-1">Admin Panel <ArrowUpRight size={14} /></Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Profile dropdown */}
      {isDropdownOpen && <ProfileDropdown setIsDropdownOpen={setIsDropdownOpen} />}
    </>
  );
}
