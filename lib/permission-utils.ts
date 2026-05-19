/**
 * Utilidades para validar y gestionar permisos
 */

import type { NextRequest } from "next/server"
import { db } from "@/db"
import { users, roles, userSessions } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export interface UserWithPermissions {
  id: string
  email: string
  name: string
  roleId: string | null
  permissions: string[]
}

/**
 * Obtiene el usuario con sus permisos desde un token de sesión
 */
export async function getUserWithPermissions(
  token: string
): Promise<UserWithPermissions | null> {
  try {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.token, token), eq(userSessions.active, true)))
      .limit(1)

    if (!session) {
      return null
    }

    // Verificar si la sesión ha expirado
    if (session.expiresAt < new Date()) {
      await db
        .update(userSessions)
        .set({ active: false })
        .where(eq(userSessions.id, session.id))
      return null
    }

    // Obtener el usuario con su rol y permisos
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        roleId: users.roleId,
        permissions: roles.permissions,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!result[0]) {
      return null
    }

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      permissions: user.permissions || [],
    }
  } catch (error) {
    console.error("[permissions] Error getting user with permissions:", error)
    return null
  }
}

/**
 * Verifica si un usuario tiene un permiso específico
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string | string[]
): boolean {
  if (Array.isArray(requiredPermission)) {
    // Si requiredPermission es un array, el usuario debe tener AL MENOS UNO
    return requiredPermission.some((perm) => userPermissions.includes(perm))
  }

  // Si es un string, el usuario debe tener exactamente ese permiso
  return userPermissions.includes(requiredPermission)
}

/**
 * Middleware para validar permisos en rutas de API
 * Retorna error 403 si el usuario no tiene el permiso requerido
 */
export async function checkPermissionAPI(
  request: NextRequest,
  requiredPermission: string | string[]
): Promise<{
  allowed: boolean
  user?: UserWithPermissions
  error?: string
}> {
  const token = request.cookies.get("session_token")?.value

  if (!token) {
    return {
      allowed: false,
      error: "No autenticado",
    }
  }

  const user = await getUserWithPermissions(token)

  if (!user) {
    return {
      allowed: false,
      error: "Sesión inválida",
    }
  }

  if (!hasPermission(user.permissions, requiredPermission)) {
    return {
      allowed: false,
      user,
      error: "Permiso denegado",
    }
  }

  return {
    allowed: true,
    user,
  }
}

/**
 * Retorna una respuesta JSON con error de permiso
 */
export function permissionDenied(message = "No tienes permiso para esta acción") {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

/**
 * Retorna una respuesta JSON con error de autenticación
 */
export function notAuthenticated(message = "No autenticado") {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
