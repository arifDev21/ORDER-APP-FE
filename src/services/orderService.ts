import { api } from './api';
import { Order, CreateOrderRequest, ApiResponse } from '@/types';

interface OrdersResponse {
  orders: Order[];
  count: number;
}

interface OrderResponse {
  order: Order;
}

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<OrderResponse>>('/orders', orderData);
    return response.data.data!.order;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<OrdersResponse>>('/orders');
    return response.data.data!.orders;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<OrderResponse>>(`/orders/${id}`);
    return response.data.data!.order;
  },

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await api.put<ApiResponse<{ changes: number }>>(`/orders/${id}/status`, { status });
  },

  async deleteOrder(id: string): Promise<void> {
    await api.delete<ApiResponse<{ changes: number }>>(`/orders/${id}`);
  },
}; 