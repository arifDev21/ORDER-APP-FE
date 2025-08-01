import { create } from 'zustand';
import { OrderState, Order, CreateOrderRequest } from '@/types';
import { orderService } from '@/services/orderService';

interface OrderStore extends OrderState {
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  setOrders: (orders: Order[]) => set({ orders }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  createOrder: async (orderData: CreateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(orderData);
      const currentOrders = get().orders;
      set({ 
        orders: [newOrder, ...currentOrders],
        isLoading: false 
      });
      return newOrder;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false 
      });
      throw error;
    }
  },
})); 