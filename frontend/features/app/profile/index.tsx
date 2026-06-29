"use client";

import Link from "next/link";
import { Mail, Shield, User, Package, ChevronRight, Hash } from "lucide-react";
import { useGetCurrentUserQuery } from "@/services/auth/authApi";
import { useAppSelector } from "@/store/hooks";
import { getImageUrl } from "@/utils/getImageUrl";
import Skeleton from "@/components/skeleton/Skeleton";

export default function ProfileFeature() {
  const cachedUser = useAppSelector((s) => s.auth.user);
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !cachedUser,
  });

  const resolvedUser = user ?? cachedUser;
  const initials = resolvedUser?.name ? resolvedUser.name.slice(0, 2).toUpperCase() : "??";
  const isAdmin = resolvedUser?.role === "ADMIN";

  if (isLoading && !resolvedUser) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary/10 via-orange-500/5 to-amber-600/10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
          {/* Avatar */}
          {resolvedUser?.avatar_url ? (
            <img
              src={getImageUrl(resolvedUser.avatar_url)}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/30 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-orange-500 to-amber-600 flex items-center justify-center shadow-lg ring-4 ring-primary/20">
              <span className="text-3xl font-bold text-white">{initials}</span>
            </div>
          )}

          {/* Name & email */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {resolvedUser?.name ?? "—"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {resolvedUser?.email ?? "—"}
            </p>
          </div>

          {/* Role badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isAdmin
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Shield className="w-3 h-3" />
            {isAdmin ? "Administrator" : "Customer"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Account Info */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Account Information
          </h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <InfoRow
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              label="Full Name"
              value={resolvedUser?.name ?? "—"}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
              label="Email Address"
              value={resolvedUser?.email ?? "—"}
            />
            <InfoRow
              icon={<Shield className="w-4 h-4 text-muted-foreground" />}
              label="Role"
              value={isAdmin ? "Administrator" : "Customer"}
            />
            <InfoRow
              icon={<Hash className="w-4 h-4 text-muted-foreground" />}
              label="User ID"
              value={resolvedUser?.id ? `#${resolvedUser.id.slice(0, 8).toUpperCase()}` : "—"}
            />
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Links
          </h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <Link href="/orders">
              <div className="flex items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            {isAdmin && (
              <Link href="/dashboard">
                <div className="flex items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-orange-500/5 to-amber-600/10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-4 w-56 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
