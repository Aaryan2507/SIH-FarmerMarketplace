import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, logoutUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

/**
 * Holds "who is logged in and what role are they" for the whole app.
 * The role ("seller" | "customer") is what drives which homepage and
 * nav links get shown -- see App.jsx for the route split.
 */
export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem("user_role"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setRole(data.role);
    setUsername(credentials.username);
    localStorage.setItem("username", credentials.username);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    localStorage.removeItem("username");
    setRole(null);
    setUsername(null);
  }, []);

  const value = { role, username, isAuthenticated: Boolean(role), login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
