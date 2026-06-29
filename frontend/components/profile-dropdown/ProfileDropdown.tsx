"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/constants/routes";
import { getImageUrl } from "@/utils/getImageUrl";

export default function ProfileDropdown({
  setIsDropdownOpen,
}: {
  setIsDropdownOpen: (value: boolean) => void;
}) {
  const { logout } = useAuth();
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const router = useRouter();

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "??";
  const isAdmin = user?.role === "ADMIN";
  const isOnDashboard = pathname.startsWith("/dashboard");

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await logout();
  };

  const handleRoleSwitch = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsDropdownOpen(false)}
        className="fixed inset-0 z-40"
      />

      {/* Dropdown card */}
      <div className="fixed top-16 right-4 w-60 bg-card rounded-xl shadow-lg border border-border z-50 p-1.5">
        {/* User info */}
        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
          <div className="px-3 py-2.5 flex items-center gap-3 border-b border-border mb-1 hover:bg-muted rounded-lg transition-colors cursor-pointer">
            {user?.avatar_url ? (
              <img
                src={getImageUrl(user.avatar_url)}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </Link>

        {/* Admin/User role toggle — ADMIN only */}
        {isAdmin && (
          <div className="px-1 pb-1 border-b border-border mb-1">
            <div className="flex items-center bg-muted rounded-full p-1">
              <button
                onClick={() => handleRoleSwitch(ROUTES.HOME)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  !isOnDashboard
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                User
              </button>
              <button
                onClick={() => handleRoleSwitch(ROUTES.DASHBOARD)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isOnDashboard
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Menu items */}
        <Link href="/orders" onClick={() => setIsDropdownOpen(false)}>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">My Orders</span>
          </div>
        </Link>

        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">My Profile</span>
          </div>
        </Link>

        {/* Sign out */}
        <div className="border-t border-border mt-1 pt-1">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-destructive/10 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
