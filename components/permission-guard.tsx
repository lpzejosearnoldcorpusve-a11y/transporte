"use client"

import { useAuth } from "@/lib/auth-context"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  permission: string | string[]
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que renderiza contenido solo si el usuario tiene los permisos requeridos
 */
export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="text-gray-500">Cargando...</div>
  }

  if (!user) {
    return <div className="text-red-500">No autenticado</div>
  }

  const hasRequiredPermission = Array.isArray(permission)
    ? permission.some((p) => user.permissions.includes(p))
    : user.permissions.includes(permission)

  if (!hasRequiredPermission) {
    return (
      fallback || (
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Acceso Denegado</p>
            <p className="mt-1 text-sm text-gray-500">No tienes permiso para ver este contenido</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
