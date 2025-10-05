import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"
import { db } from "@/db"
import { roles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session_token")?.value

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const result = await validateSession(token)

    if (!result) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
    }

    const { user } = result

    // Obtener rol del usuario
    let userRole = null;
    if (user.roleId) {
      [userRole] = await db.select().from(roles).where(eq(roles.id, user.roleId)).limit(1);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole?.name || null,
        permissions: userRole?.permissions || [],
      },
    })
  } catch (error) {
    console.error("[v0] Error obteniendo usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
