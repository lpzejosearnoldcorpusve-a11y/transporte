"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string | null
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  // Verificar autenticación cada vez que cambia la ruta
  useEffect(() => {
    if (!isLoading && pathname.startsWith("/dashboard") && !user) {
      // Si estamos en dashboard pero no hay usuario, redirigir al login
      router.push("/")
    }
  }, [pathname, user, isLoading, router])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")

      // Si retorna 401 o no es ok, no hay sesión válida
      if (!response.ok) {
        if (response.status === 401) {
          // Sesión expirada o inválida
          setUser(null)
          // Si estamos en dashboard, redirigir al login
          if (pathname.startsWith("/dashboard")) {
            router.push("/")
          }
        }
        setIsLoading(false)
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("[v0] Error verificando autenticación:", error)
      setUser(null)
      // Por seguridad, si hay error al verificar, redirigir al login si estamos en dashboard
      if (pathname.startsWith("/dashboard")) {
        router.push("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al iniciar sesión")
      }

      const data = await response.json()
      setUser(data.user)
      // No hacer router.push aquí - dejarlo al componente que llama
    } catch (error) {
      console.error("[auth] Error en login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("[v0] Error en logout:", error)
    } finally {
      setUser(null)
      router.push("/")
    }
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
