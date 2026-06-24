/**
 * Script para asignar un rol a un usuario
 * Ejecutar con: npx tsx db/assign-role.ts <email> <roleName>
 * Ejemplo: npx tsx db/assign-role.ts admin@example.com Admin
 */

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { users, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const assignRole = async () => {
  const [email, roleName] = process.argv.slice(2)

  if (!email || !roleName) {
    console.log("❌ Uso: npx tsx db/assign-role.ts <email> <roleName>")
    console.log("Ejemplo: npx tsx db/assign-role.ts admin@example.com Admin")
    console.log("\nRoles disponibles: Admin, Supervisor, Operador, Conductor, Mecanico")
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL no está definida")
    process.exit(1)
  }

  console.log(`📍 Asignando rol "${roleName}" a ${email}...`)

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    // Buscar el rol
    const [roleRecord] = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1)

    if (!roleRecord) {
      console.log(`❌ Rol "${roleName}" no encontrado`)
      console.log("Roles disponibles: Admin, Supervisor, Operador, Conductor, Mecanico")
      process.exit(1)
    }

    // Buscar el usuario
    const [userRecord] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!userRecord) {
      console.log(`❌ Usuario con email "${email}" no encontrado`)
      process.exit(1)
    }

    // Asignar rol
    await db.update(users).set({ roleId: roleRecord.id }).where(eq(users.id, userRecord.id))

    console.log(`✅ Rol "${roleName}" asignado a ${email}`)
    console.log(`👤 Usuario: ${userRecord.name}`)
    console.log(`🔑 Permisos: ${roleRecord.permissions.join(", ")}`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

assignRole()
