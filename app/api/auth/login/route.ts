import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario por email
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        password: users.password,
        active: users.active,
        roleId: users.roleId,
        profileImage: users.profileImage, 
        roleName: roles.name,
        rolePermissions: roles.permissions,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email))
      .limit(1)

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const userData = user[0]

    if (!userData.active) {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, userData.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear sesión
    const userAgent = request.headers.get("user-agent") || undefined
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

    const session = await createSession(userData.id, userAgent, ip)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.roleName,
        profileImage: userData.profileImage, // 👈 Agregar en la respuesta
        permissions: userData.rolePermissions,
      },
    })

    // Establecer cookie de sesión
    response.cookies.set("session_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[auth/login] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}