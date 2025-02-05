import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
  bookings: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  addToFavorites: (turfId: string) => void;
  removeFromFavorites: (turfId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data - In a real app, this would come from a backend
const MOCK_USER = {
  id: '1',
  name: 'Vedant Somankar',
  email: 'awesomenobel2@getsafesurfer.com',
  favorites: [],
  bookings: [],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - In a real app, this would make an API call
    setUser(MOCK_USER);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - In a real app, this would make an API call
    const newUser = { ...MOCK_USER, name, email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const addToFavorites = (turfId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      favorites: [...user.favorites, turfId],
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const removeFromFavorites = (turfId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      favorites: user.favorites.filter(id => id !== turfId),
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      addToFavorites,
      removeFromFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}