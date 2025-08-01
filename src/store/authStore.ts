import { create } from 'zustand';
import { AuthState, LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: null, // Start with null to indicate not initialized
  isLoading: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.login(credentials);
      authService.saveToken(token);
      authService.saveUser(user);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initializeAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    
    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
})); 