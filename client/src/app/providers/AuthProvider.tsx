// src/app/providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { getMe } from "@/features/auth/services/auth.service"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setSession: (payload: { user: User; token: string; remember: boolean }) => void
  clearSession: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    setUser(null)
    setToken(null)
  }

  const setSession = ({
    user,
    token,
    remember,
  }: {
    user: User
    token: string
    remember: boolean
  }) => {
    if (remember) {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
    } else {
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("user", JSON.stringify(user))
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }

    setUser(user)
    setToken(token)
  }

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token")

    if (!storedToken) {
      setIsLoading(false)
      return
    }

    ;(async () => {
      try {
        const me = await getMe(storedToken)
        setUser(me.user ?? me)
        setToken(storedToken)
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}