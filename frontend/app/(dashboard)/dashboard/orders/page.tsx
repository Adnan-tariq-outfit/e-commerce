import AdminOrdersFeature from '@/features/dashboard/orders';

export const metadata = {
  title: 'Orders | FORMA Admin',
  description: 'Manage customer orders',
};

export default function OrdersPage() {
  return (
    <div className="p-8">
      <AdminOrdersFeature />
    </div>
  );
}
