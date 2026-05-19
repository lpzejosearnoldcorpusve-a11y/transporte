import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserWithPermissions, hasPermission } from "@/lib/permission-utils"
import { ROUTE_PERMISSIONS } from "@/lib/permissions"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/"]

  // 1. Si está en una ruta pública y tiene sesión válida, redirigir al dashboard
  if (publicPaths.includes(pathname) && token) {
    // Validar que la sesión sea válida
    const user = await getUserWithPermissions(token)
    if (user) {
      // Sesión válida, ir a dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Si sesión no es válida, eliminar la cookie y dejar continuar al login
    const response = NextResponse.next()
    response.cookies.delete("session_token")
    return response
  }

  // 2. Si intenta acceder a /dashboard sin token, redirigir al login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // 3. Validar que la sesión sea válida
    const user = await getUserWithPermissions(token)

    if (!user) {
      // Sesión inválida o expirada, redirigir al login y eliminar cookie
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("session_token")
      return response
    }

    // 4. Verificar permisos para rutas específicas
    // Si el user tiene permisos, validar la ruta requerida
    // Si no tiene permisos (vacío), permitir acceso (caso de admin sin permisos cargados)
    if (user.permissions && user.permissions.length > 0) {
      const requiredPermission = ROUTE_PERMISSIONS[pathname]

      if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
        // No tiene permiso - redirigir al dashboard principal
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}


