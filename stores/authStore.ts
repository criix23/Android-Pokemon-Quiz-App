import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    username: string;
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    try {
      // Enhanced email validation with regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!email || !emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Additional check for suspicious/fake emails
      const suspiciousPatterns = [
        /^[a-z]{1,5}@[a-z]{1,5}\.[a-z]{2,3}$/,  // Like assas@asas.xyz
        /^test@.*$/,                            // Starts with test@
        /^.*@example\.com$/,                    // Ends with @example.com
        /^[a-z]+@[a-z]+\.[a-z]{2,3}$/           // Simple repeating patterns
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(email.toLowerCase()))) {
        throw new Error('Please enter a real email address');
      }
      
      // Password validation
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // This is a mock implementation - in a real app you would verify with a server
      // For demo purposes, we'll accept any valid format email/password and create a mock user
      const user = {
        id: '1',
        email: email,
        username: email.split('@')[0], // Use part before @ as username
      };
      
      // "Save" user to storage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      set({ 
        isAuthenticated: true,
        user: user 
      });
    } catch (error) {
      // Re-throw the error to be handled by the UI
      throw error;
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
}));