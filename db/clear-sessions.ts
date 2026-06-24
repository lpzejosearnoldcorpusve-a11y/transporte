/**
 * Script para limpiar sesiones activas de un usuario
 * Ejecutar con: npx tsx db/clear-sessions.ts <email>
 */

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { users, userSessions } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const clearSessions = async () => {
  const [email] = process.argv.slice(2)

  if (!email) {
    console.log("❌ Uso: npx tsx db/clear-sessions.ts <email>")
    console.log("Ejemplo: npx tsx db/clear-sessions.ts arnold@gmail.com")
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL no está definida")
    process.exit(1)
  }

  console.log(`\n🔄 Limpiando sesiones de: ${email}...\n`)

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    // Buscar el usuario
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user) {
      console.log(`❌ Usuario "${email}" no encontrado`)
      process.exit(1)
    }

    // Contar sesiones activas antes
    const sessionsBefore = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, user.id))

    console.log(`📊 Sesiones encontradas: ${sessionsBefore.length}`)

    // Marcar todas las sesiones como inactivas
    const result = await db
      .update(userSessions)
      .set({ active: false })
      .where(eq(userSessions.userId, user.id))

    console.log(`✅ Sesiones desactivadas exitosamente`)
    console.log(`👤 Usuario: ${user.name}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`\n💡 Próximos pasos:`)
    console.log(`   1. Recarga la página en el navegador`)
    console.log(`   2. Haz logout`)
    console.log(`   3. Haz login nuevamente con arnold@gmail.com / hola1234`)
    console.log(`   4. ¡Ahora sí deberías ver Gastos y Facturas!`)
    console.log()

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

clearSessions()
