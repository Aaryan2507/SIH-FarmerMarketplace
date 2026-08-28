import { createContext, useContext, useState, useCallback, useMemo } from "react"
import * as authService from "@/services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loggedInUser } = await authService.login(credentials)
      setUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      setError(err.message || "Unable to sign in.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const loginWithOtp = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { user: loggedInUser } = await authService.loginWithOtp(payload)
      setUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      setError(err.message || "Unable to sign in.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { user: newUser } = await authService.signup(payload)
      setUser(newUser)
      return newUser
    } catch (err) {
      setError(err.message || "Unable to create account.")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyAadhaar = useCallback(async (lastFour) => {
    const res = await authService.verifyAadhaar(lastFour)
    if (res.user) setUser(res.user)
    return res
  }, [])

  const refreshUser = useCallback((updated) => {
    setUser(updated)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      loginWithOtp,
      signup,
      logout,
      verifyAadhaar,
      refreshUser,
      setError,
    }),
    [user, loading, error, login, loginWithOtp, signup, logout, verifyAadhaar, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
