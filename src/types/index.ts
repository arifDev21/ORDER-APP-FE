export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  productName: string;
}

export interface Order {
  id: number;
  userId?: number;
  total_amount: string; // API menggunakan snake_case
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: {
    message: string;
    details?: string[];
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
} 