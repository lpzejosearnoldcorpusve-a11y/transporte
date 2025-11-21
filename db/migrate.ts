
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config({ path: ".env.local" })

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida")
  }

  console.log("⏳ Ejecutando migraciones...")

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  await migrate(db, { migrationsFolder: "./drizzle" })

  console.log("✅ Migraciones completadas exitosamente")
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error("❌ Error al ejecutar migraciones:", err)
  process.exit(1)
})
