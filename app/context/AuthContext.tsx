'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  role: 'admin' | 'staff' | 'owner' | 'guest';
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loadingAnimation: boolean;
  setLoadingAnimation: (show: boolean) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAnimation, _setLoadingAnimation] = useState(false);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const minDuration = 1000; 
  const showDelay = 0;
  const loaderShownAt = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: User = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch (err) {
        setUser(null);
      }
    }
  }, []);

  const setLoadingAnimation = (show: boolean) => {
    if (show) {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      showTimeout.current = setTimeout(() => {
        loaderShownAt.current = Date.now();
        _setLoadingAnimation(true);
      }, showDelay);
    } else {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      const now = Date.now();

      if (loaderShownAt.current && now - loaderShownAt.current < minDuration) {
        const remaining = minDuration - (now - loaderShownAt.current);
        hideTimeout.current = setTimeout(() => {
          _setLoadingAnimation(false);
          loaderShownAt.current = null;
        }, remaining);
      } else {
        _setLoadingAnimation(false);
        loaderShownAt.current = null;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loadingAnimation, setLoadingAnimation }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
