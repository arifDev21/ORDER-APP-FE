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
import { Package, AlertCircle, CheckCircle, ShoppingCart } from 'lucide-react';
import { z } from 'zod';

const quickOrderSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

type QuickOrderFormData = z.infer<typeof quickOrderSchema>;

interface CartItem {
  product: Product;
  quantity: number;
}

interface QuickOrderFormProps {
  product?: Product;
  cartItems?: CartItem[];
  onSuccess: () => void;
  onClose: () => void;
}

const QuickOrderForm: React.FC<QuickOrderFormProps> = ({ 
  product, 
  cartItems,
  onSuccess, 
  onClose 
}) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();
  const { createOrder, isLoading } = useOrderStore();

  const isCartOrder = !!cartItems && cartItems.length > 0;
  const singleProduct = product;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuickOrderFormData>({
    resolver: zodResolver(quickOrderSchema),
    defaultValues: {
      quantity: singleProduct ? 1 : undefined,
    },
  });

  const quantity = watch('quantity') || 1;
  
  // Calculate totals
  const singleProductTotal = singleProduct ? parseFloat(singleProduct.price) * quantity : 0;
  const cartTotal = cartItems ? cartItems.reduce((total, item) => {
    return total + (parseFloat(item.product.price) * item.quantity);
  }, 0) : 0;
  
  const totalPrice = isCartOrder ? cartTotal : singleProductTotal;

  const onSubmit = async (data?: QuickOrderFormData) => {
    try {
      setError('');
      setSuccess('');
      
      let orderData;
      
      if (isCartOrder && cartItems) {
        // Cart order - no form data needed
        orderData = {
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        };
      } else if (singleProduct && data) {
        // Single product order - need form data
        orderData = {
          items: [
            {
              productId: singleProduct.id,
              quantity: data.quantity,
            },
          ],
        };
      } else {
        throw new Error('No product or cart items provided');
      }

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

      {isCartOrder ? (
        /* Cart Order Display */
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-6 w-6 text-blue-500" />
            <h4 className="font-semibold text-gray-900">Order Summary</h4>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems!.map((item) => (
              <div key={item.product.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-blue-500">
                      {formatCurrency(parseFloat(item.product.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Single Product Display */
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{singleProduct!.name}</h4>
              <p className="text-sm text-gray-600">{singleProduct!.description}</p>
              <p className="text-lg font-bold text-blue-500 mt-1">
                {formatCurrency(singleProduct!.price)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Form - Only show for single product */}
      {!isCartOrder && singleProduct && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Quantity"
            type="number"
            min="1"
            max={singleProduct.stock}
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />

          {/* Stock Info */}
          <div className="text-sm text-gray-600">
            Available stock: <span className="font-medium">{singleProduct.stock} units</span>
          </div>
        </form>
      )}

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
          type="button"
          onClick={isCartOrder ? () => onSubmit() : handleSubmit(onSubmit)}
          className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          loading={isLoading}
          disabled={!isCartOrder && singleProduct ? quantity > singleProduct.stock : false}
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default QuickOrderForm; 