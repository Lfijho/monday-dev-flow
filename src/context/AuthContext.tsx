import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Simula carregamento inicial do estado de auth
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - substituir pela integração Supabase depois
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0]
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Mock register - substituir pela integração Supabase depois
    const mockUser: User = {
      id: '1',
      email,
      name
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};