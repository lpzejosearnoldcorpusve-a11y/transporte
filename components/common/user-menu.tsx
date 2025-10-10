"use client"

import { LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"

export function UserMenu() {
  const { user: authUser, logout } = useAuth()
  const [user, setUser] = useState<typeof authUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(authUser || null)
    setIsLoading(false)
  }, [authUser])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-green-100">
          <User className="h-5 w-5 text-forest-green-900" />
        </div>
        <div className="hidden md:block">
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900">{user?.name || "Usuario"}</p>
              <p className="text-xs text-gray-500">{user?.email || "usuario@empresa.com"}</p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-forest-green-900"
        aria-label="Cerrar sesión"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
}
