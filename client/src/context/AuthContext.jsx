import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('helix_token'));
  const [loading, setLoading] = useState(true);

  // Set default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token on mount
      axios.get('http://localhost:5070/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5070/api/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('helix_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5070/api/auth/register', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('helix_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('helix_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
