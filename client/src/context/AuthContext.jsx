import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, fetchProfile } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("geominer_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("geominer_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("geominer_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("geominer_token");
        localStorage.removeItem("geominer_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await loginUser({ email, password });
    localStorage.setItem("geominer_token", token);
    localStorage.setItem("geominer_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user } = await registerUser(payload);
    localStorage.setItem("geominer_token", token);
    localStorage.setItem("geominer_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("geominer_token");
    localStorage.removeItem("geominer_user");
    setUser(null);
  }, []);

  const updateLocalUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem("geominer_user", JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
