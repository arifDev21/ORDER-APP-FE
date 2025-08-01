'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import { Package, History, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">Simple Orders</span>
            </Link>
          </div>

          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/products" 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link 
                href="/orders" 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
              >
                <History className="h-4 w-4" />
                <span>Order History</span>
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 