import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, saveToken, clearToken, getToken } from "../api/client";

const AuthContext = createContext(null);
const USER_KEY = "clearance_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setLoading(false);
    })();
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    await saveToken(data.token);
    const userData = { email: data.email, fullName: data.fullName };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }

  async function register(fullName, email, password) {
    const data = await api.register({ fullName, email, password });
    await saveToken(data.token);
    const userData = { email: data.email, fullName: data.fullName };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }

  async function logout() {
    await clearToken();
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
