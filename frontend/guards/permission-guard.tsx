"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/constants/routes";

interface PermissionGuardProps {
  allowedRoles: ("CUSTOMER" | "ADMIN")[];
  children: React.ReactNode;
}

export default function PermissionGuard({ allowedRoles, children }: PermissionGuardProps) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(ROUTES.HOME);
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) return <div>Loading...</div>;

  return <>{children}</>;
}
