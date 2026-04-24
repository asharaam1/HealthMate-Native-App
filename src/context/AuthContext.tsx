import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import type { User } from '../types'; // ✅ shared type use karo

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  // App open hone par stored session check karo
  const restoreSession = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Session restore error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['token', token],
      ]);
      setUser(user);
    } catch (e) {
      console.error('Login error:', e);
      throw e; // Screen pe error dikhane ke liye rethrow
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { user, token } = res.data;
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['token', token],
      ]);
      setUser(user);
    } catch (e) {
      console.error('Signup error:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token']);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
