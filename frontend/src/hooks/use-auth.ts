import { useState, useEffect } from 'react';

export interface AuthUser {
  id?: string;
  fullName?: string;
  email?: string;
  userType?: 'volunteer' | 'organization' | 'admin';
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for auth info
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    const userJson = localStorage.getItem('user');

    if (token && userType) {
      try {
        const userData = userJson ? JSON.parse(userJson) : {};
        setUser({ 
          ...userData, 
          userType: userType as 'volunteer' | 'organization' | 'admin' 
        });
      } catch (error) {
        console.error("Error parsing user data", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  const login = (userData: any, token: string, type: 'volunteer' | 'organization' | 'admin') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', type);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ ...userData, userType: type });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    window.location.href = '/';
  };

  return { user, loading, login, logout };
}
