import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, fetchMe, silentRefresh } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, try to silently refresh using the httpOnly cookie.
  // If a session exists, this restores login without the user re-entering credentials.
  useEffect(() => {
    (async () => {
      try {
        await silentRefresh();
        const me = await fetchMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const me = await loginUser({ email, password });
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const me = await registerUser(payload);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
