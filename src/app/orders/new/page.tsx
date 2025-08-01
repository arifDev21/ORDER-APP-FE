import OrderForm from '@/components/forms/OrderForm';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function NewOrderPage() {
  return (
    <ProtectedRoute>
      <OrderForm />
    </ProtectedRoute>
  );
} 