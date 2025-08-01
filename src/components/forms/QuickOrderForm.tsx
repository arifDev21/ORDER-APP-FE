'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/orderStore';
import { Product } from '@/types';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/utils/format';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const quickOrderSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

type QuickOrderFormData = z.infer<typeof quickOrderSchema>;

interface QuickOrderFormProps {
  product: Product;
  onSuccess: () => void;
  onClose: () => void;
}

const QuickOrderForm: React.FC<QuickOrderFormProps> = ({ 
  product, 
  onSuccess, 
  onClose 
}) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();
  const { createOrder, isLoading } = useOrderStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuickOrderFormData>({
    resolver: zodResolver(quickOrderSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = watch('quantity') || 1;
  const totalPrice = parseFloat(product.price) * quantity;

  const onSubmit = async (data: QuickOrderFormData) => {
    try {
      setError('');
      setSuccess('');
      
      const orderData = {
        items: [
          {
            productId: product.id,
            quantity: data.quantity,
          },
        ],
      };

      await createOrder(orderData);
      setSuccess('Order placed successfully!');
      
      setTimeout(() => {
        onSuccess();
        router.push('/orders');
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to place order');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Product Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <Package className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-lg font-bold text-blue-500 mt-1">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Quantity"
          type="number"
          min="1"
          max={product.stock}
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        {/* Stock Info */}
        <div className="text-sm text-gray-600">
          Available stock: <span className="font-medium">{product.stock} units</span>
        </div>

        {/* Total */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total:</span>
            <span className="text-xl font-bold text-blue-500">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
            loading={isLoading}
            disabled={quantity > product.stock}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuickOrderForm; 