import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'user' | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('nucleus_user');
      const userId = localStorage.getItem('nucleus_user_id');
      
      console.log('Auth initialization:', { savedUser: !!savedUser, userId });
      
      if (savedUser && userId) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('Setting user from localStorage:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('nucleus_user');
          localStorage.removeItem('nucleus_user_id');
          setUser(null);
        }
      }
      
      console.log('Auth initialization complete, setting loading to false');
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: LoginResponse & { token?: string }) => {
    setUser(userData);
    localStorage.setItem('nucleus_user', JSON.stringify(userData));
    localStorage.setItem('nucleus_user_id', userData.id.toString());
    
    // Store JWT token if available
    if (userData.token) {
      localStorage.setItem('nucleus_auth_token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nucleus_user');
    localStorage.removeItem('nucleus_user_id');
    localStorage.removeItem('nucleus_auth_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
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
