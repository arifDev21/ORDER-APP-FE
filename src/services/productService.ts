import { api } from './api';
import { Product, ApiResponse } from '@/types';

interface ProductsResponse {
  products: Product[];
  count: number;
}

interface ProductResponse {
  product: Product;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<ProductsResponse>>('/products');
    return response.data.data!.products;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<ProductResponse>>(`/products/${id}`);
    return response.data.data!.product;
  },

  async createProduct(productData: { name: string; price: number; stock: number; description?: string }): Promise<Product> {
    const response = await api.post<ApiResponse<ProductResponse>>('/products', productData);
    return response.data.data!.product;
  },

  async updateProduct(id: string, productData: { name?: string; price?: number; stock?: number; description?: string }): Promise<void> {
    await api.put<ApiResponse<{ changes: number }>>(`/products/${id}`, productData);
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete<ApiResponse<{ changes: number }>>(`/products/${id}`);
  },
}; 