import DashboardLayout from "@/layouts/dashboard";
import AuthGuard from "@/guards/auth-guard";
import PermissionGuard from "@/guards/permission-guard";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PermissionGuard allowedRoles={["ADMIN"]}>
        <DashboardLayout>{children}</DashboardLayout>
      </PermissionGuard>
    </AuthGuard>
  );
}
