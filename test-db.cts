// test-db.ts
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { sql } from "drizzle-orm"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function main() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    const db = drizzle(pool)

    // Ejecuta una consulta simple
    const result = await db.execute(sql`SELECT NOW() AS server_time`)
    console.log("✅ Conexión exitosa!")
    console.log("Hora del servidor:", result.rows[0].server_time)

    await pool.end() // Cierra la conexión
  } catch (error: any) {
    console.error("❌ Error al conectar a la base de datos:", error.message)
  }
}

main()
