'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { orderSchema, OrderFormData } from '@/utils/validation';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Plus, Trash2, Package } from 'lucide-react';

const OrderForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
  const { createOrder, isLoading: orderLoading } = useOrderStore();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ productId: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      setError('');
      await createOrder(data);
      router.push('/orders');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create order');
    }
  };

  const addItem = () => {
    append({ productId: 0, quantity: 1 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return watchedItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return total + (parseFloat(product.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="mt-2 text-gray-600">Select products and quantities for your order</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product {index + 1}
                      </label>
                      <select
                        {...register(`items.${index}.productId`, { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0}>Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        error={errors.items?.[index]?.quantity?.message}
                      />
                    </div>
                  </div>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          {watchedItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2">
                {watchedItems.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.name} x {item.quantity}</span>
                      <span>{formatCurrency(parseFloat(product.price) * item.quantity)}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={orderLoading}
              disabled={watchedItems.some(item => item.productId === 0)}
            >
              Create Order
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OrderForm; 