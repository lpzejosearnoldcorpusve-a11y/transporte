import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

// Verificar que la variable de entorno existe
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno")
}

// Crear cliente de Neon
const sql = neon(process.env.DATABASE_URL)

// Crear instancia de Drizzle con el esquema
export const db = drizzle(sql, { schema })

// Exportar el esquema para uso en otras partes de la aplicación
export { schema }
