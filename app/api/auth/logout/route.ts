import { type NextRequest, NextResponse } from "next/server"
import { invalidateSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session_token")?.value

    if (token) {
      await invalidateSession(token)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("[v0] Error en logout:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
