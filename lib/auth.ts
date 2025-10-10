import { db } from "@/db"
import { users, userSessions } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { createId } from "@paralleldrive/cuid2"

// Función para hashear contraseñas
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Función para verificar contraseñas
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Función para crear una sesión
export async function createSession(userId: string, userAgent?: string, ip?: string) {
  const token = createId()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 1) // Sesión válida por 1 día

  const [session] = await db
    .insert(userSessions)
    .values({
      userId,
      token,
      expiresAt,
      userAgent,
      ip,
    })
    .returning()

  return session
}

// Función para validar una sesión
export async function validateSession(token: string) {
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
    await db.update(userSessions).set({ active: false }).where(eq(userSessions.id, session.id))
    return null
  }

  // Obtener el usuario asociado
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1)

  if (!user || !user.active) {
    return null
  }

  return { session, user }
}

// Función para cerrar sesión
export async function invalidateSession(token: string) {
  await db.update(userSessions).set({ active: false }).where(eq(userSessions.token, token))
}
