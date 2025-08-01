'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { formatCurrency } from '@/utils/format';

import Modal from '@/components/ui/Modal';
import QuickOrderForm from '@/components/forms/QuickOrderForm';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Package, AlertCircle, ShoppingCart, Star, Search, X } from 'lucide-react';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

function ProductsPageContent() {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart(prevCart => prevCart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

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

  const handleCheckout = () => {
    setIsCartModalOpen(true);
  };

  const handleCartOrderSuccess = () => {
    setIsCartModalOpen(false);
    setCart([]); // Clear cart after successful order
    fetchProducts(); // Refresh products to update stock
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
          
          {/* Search and Cart Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              {/* Cart Button */}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all duration-200 group"
                disabled={cart.length === 0}
              >
                <ShoppingCart className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
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
            {cartItemCount > 0 && (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <span>{cartItemCount} items in cart</span>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find(item => item.product.id === product.id);
              const isInCart = !!cartItem;
              
              return (
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

                      {/* Cart Controls */}
                      {isInCart ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                            <button
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="font-medium text-blue-700">{cartItem.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(product.id, cartItem.quantity + 1)}
                              disabled={cartItem.quantity >= product.stock}
                              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="w-full py-2 px-4 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                              product.stock > 0
                                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={product.stock === 0}
                          >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                          <button 
                            onClick={() => handleOrderClick(product)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                              product.stock > 0
                                ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
                                : 'border border-gray-300 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={product.stock === 0}
                          >
                            Quick Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* Checkout Button - Fixed at bottom */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Checkout ({cartItemCount} items)</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm font-bold">
                {formatCurrency(cartTotal)}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Single Product Order Modal */}
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

      {/* Cart Checkout Modal */}
      <Modal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        title="Shopping Cart"
        size="xl"
      >
        <div className="space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some products to your cart to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.product.price)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-medium text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(item.product.price) * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Complete Your Order</h4>
                <QuickOrderForm
                  cartItems={cart}
                  onSuccess={handleCartOrderSuccess}
                  onClose={() => setIsCartModalOpen(false)}
                />
              </div>
            </>
          )}
        </div>
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