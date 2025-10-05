"use client"

import { LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function UserMenu() {
  const { user, logout } = useAuth()

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
          <p className="text-sm font-medium text-gray-900">{user?.name || "Usuario"}</p>
          <p className="text-xs text-gray-500">{user?.email || "usuario@empresa.com"}</p>
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
