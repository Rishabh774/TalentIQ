import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext(null);

const TOKEN_KEY = "talentiq_token";
const USER_KEY = "talentiq_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // attach token to every axios request
  useEffect(() => {
    const id = axiosInstance.interceptors.request.use((config) => {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });
    setIsLoaded(true);
    return () => axiosInstance.interceptors.request.eject(id);
  }, []);

  const signInWithGoogle = useCallback(async (payload) => {
    // payload is { credential } (ID token) or { accessToken }
    const { data } = await axiosInstance.post("/auth/google", payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isSignedIn: !!token,
      isLoaded,
      signInWithGoogle,
      signOut,
    }),
    [token, user, isLoaded, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
