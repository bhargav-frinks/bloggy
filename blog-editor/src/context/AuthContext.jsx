import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, removeCookie, setCookie } from '@/shared/hocs/withAuthenticated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('blog_user');
    const token = getCookie();
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else if (!token) {
      localStorage.removeItem('blog_user');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    localStorage.setItem('blog_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('blog_user');
    removeCookie();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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

export default AuthContext;
