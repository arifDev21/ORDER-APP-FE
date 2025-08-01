'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { formatCurrency } from '@/utils/format';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import QuickOrderForm from '@/components/forms/QuickOrderForm';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Package, AlertCircle, ShoppingCart, Star, Search } from 'lucide-react';
import { Product } from '@/types';

function ProductsPageContent() {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOrderSuccess = () => {
    handleModalClose();
    // Refresh products to update stock
    fetchProducts();
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Discover our amazing collection of high-quality products at competitive prices
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>{filteredProducts.length} of {products.length} Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    <Package className="h-16 w-16 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Content */}
                  <div className="flex-1 flex flex-col p-6">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition-colors mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Product Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-blue-500">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Order Button */}
                    <button 
                      onClick={() => handleOrderClick(product)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                No products match your search criteria. Try adjusting your search terms.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Empty State - Only show when no products at all */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600">
                We&apos;re currently updating our product catalog. Please check back soon!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Place Order"
        size="lg"
      >
        {selectedProduct && (
          <QuickOrderForm
            product={selectedProduct}
            onSuccess={handleOrderSuccess}
            onClose={handleModalClose}
          />
        )}
      </Modal>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageContent />
    </ProtectedRoute>
  );
} 