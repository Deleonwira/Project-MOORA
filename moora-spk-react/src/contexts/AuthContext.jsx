import { useState, useCallback, useEffect } from 'react';
import * as api from '../lib/api';
import { AuthContext } from './authContext';

export { AuthContext };

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await api.authCheck();
      if (data.loggedIn && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const data = await api.authLogin(email, password);
    if (data.success && data.user) {
      setCurrentUser(data.user);
    }
    return data;
  }, []);

  const register = useCallback(async (nama, email, password) => {
    const data = await api.authRegister(nama, email, password);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const data = await api.authLogout();
    setCurrentUser(null);
    return data;
  }, []);

  const isLoggedIn = currentUser !== null;

  return (
    <AuthContext.Provider value={{ currentUser, loading, isLoggedIn, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
