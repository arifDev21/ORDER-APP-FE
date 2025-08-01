'use client';

import React, { useEffect } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency, formatDate, formatStatus } from '@/utils/format';
import Card from '@/components/ui/Card';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { History, AlertCircle, Package, Calendar } from 'lucide-react';

function OrdersPageContent() {
  const { orders, fetchOrders, isLoading, error } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your previous orders and their current status
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <History className="h-4 w-4" />
              <span>{orders.length} Orders</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>All Time</span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="group">
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <Package className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {formatStatus(order.status)}
                      </span>
                      <div className="flex items-center justify-end space-x-1">
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Order Items</span>
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-500">{index + 1}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{item.productName}</span>
                              <div className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(parseFloat(item.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
              <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-4">
                You haven&apos;t placed any orders yet. Start shopping to see your order history here!
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  );
} 