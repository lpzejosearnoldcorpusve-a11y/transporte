/**
 * Script para verificar el rol de un usuario
 * Ejecutar con: npx tsx db/check-user.ts <email>
 */

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { users, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const checkUser = async () => {
  const [email] = process.argv.slice(2)

  if (!email) {
    console.log("❌ Uso: npx tsx db/check-user.ts <email>")
    console.log("Ejemplo: npx tsx db/check-user.ts arnold@gmail.com")
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL no está definida")
    process.exit(1)
  }

  console.log(`\n🔍 Verificando usuario: ${email}...\n`)

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    // Buscar el usuario con su rol
    const result = await db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        userRoleId: users.roleId,
        roleName: roles.name,
        rolePermissions: roles.permissions,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email))
      .limit(1)

    if (!result || result.length === 0) {
      console.log(`❌ Usuario "${email}" no encontrado`)
      process.exit(1)
    }

    const user = result[0]

    console.log(`👤 Usuario: ${user.userName}`)
    console.log(`📧 Email: ${user.userEmail}`)
    console.log(`🆔 ID: ${user.userId}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    if (!user.userRoleId) {
      console.log(`⚠️  ¡NO TIENE ROL ASIGNADO!`)
    } else {
      console.log(`✅ Rol: ${user.roleName}`)
      console.log(`🔑 Permisos (${user.rolePermissions?.length || 0}):`)
      user.rolePermissions?.forEach((perm) => {
        console.log(`   • ${perm}`)
      })
    }

    console.log()
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

checkUser()
