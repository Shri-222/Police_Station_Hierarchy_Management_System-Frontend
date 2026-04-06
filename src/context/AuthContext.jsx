import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setBooting(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        unitId: decoded.unitId,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      console.error('Invalid token found in storage');
      localStorage.removeItem('token');
    } finally {
      setBooting(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      if (!data?.token) {
        return { success: false, error: 'Token not returned by server' };
      }

      localStorage.setItem('token', data.token);

      const decoded = jwtDecode(data.token);
      setUser({
        id: decoded.id,
        unitId: decoded.unitId,
        email: decoded.email,
        role: decoded.role,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Authentication failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout }),
    [user]
  );

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);