import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/"]

  // Si está en una ruta pública y tiene sesión, redirigir al dashboard
  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si está en una ruta protegida y no tiene sesión, redirigir al login
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
