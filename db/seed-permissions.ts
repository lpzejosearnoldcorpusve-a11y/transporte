/**
 * Script para poblar la base de datos con roles y permisos predefinidos
 * Ejecutar con: npx tsx db/seed-permissions.ts
 */

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { DEFAULT_ROLES } from "@/lib/permissions"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const seedPermissions = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida")
  }

  console.log("🌱 Sembrando roles y permisos predefinidos...")

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    // Iterar sobre los roles predefinidos
    for (const roleKey of Object.keys(DEFAULT_ROLES)) {
      const roleConfig = DEFAULT_ROLES[roleKey as keyof typeof DEFAULT_ROLES]

      // Verificar si el rol ya existe
      const existing = await db
        .select()
        .from(roles)
        .where(eq(roles.name, roleConfig.name))
        .limit(1)

      if (existing.length > 0) {
        console.log(`✏️  Actualizando rol: ${roleConfig.name}`)
        await db
          .update(roles)
          .set({
            description: roleConfig.description,
            permissions: [...roleConfig.permissions],
          })
          .where(eq(roles.name, roleConfig.name))
      } else {
        console.log(`✨ Creando rol: ${roleConfig.name}`)
        await db.insert(roles).values({
          name: roleConfig.name,
          description: roleConfig.description,
          permissions: [...roleConfig.permissions],
        })
      }
    }

    console.log("✅ Roles y permisos sembrados exitosamente")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error al sembrar roles:", error)
    process.exit(1)
  }
}

seedPermissions()
