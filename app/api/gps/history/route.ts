import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { gpsTracking } from "@/db/schema"
import { desc, eq, and, gte, lte } from "drizzle-orm"

// GET - Obtener historial de posiciones de un vehículo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehiculoId = searchParams.get("vehiculoId")
    const desde = searchParams.get("desde")
    const hasta = searchParams.get("hasta")
    const limit = Number.parseInt(searchParams.get("limit") || "1000")

    if (!vehiculoId) {
      return NextResponse.json({ error: "vehiculoId es requerido" }, { status: 400 })
    }

    const whereConditions = [eq(gpsTracking.vehiculoId, vehiculoId)]

    if (desde) {
      whereConditions.push(gte(gpsTracking.timestamp, new Date(desde)))
    }

    if (hasta) {
      whereConditions.push(lte(gpsTracking.timestamp, new Date(hasta)))
    }

    const historial = await db.query.gpsTracking.findMany({
      where: and(...whereConditions),
      orderBy: [desc(gpsTracking.timestamp)],
      limit,
    })

    const historialFormateado = historial.map((pos) => ({
      ...pos,
      latitud: Number.parseFloat(pos.latitud),
      longitud: Number.parseFloat(pos.longitud),
      altitud: pos.altitud ? Number.parseFloat(pos.altitud) : undefined,
      satelites: pos.satelites ? Number.parseInt(pos.satelites) : undefined,
      velocidad: pos.velocidad ? Number.parseFloat(pos.velocidad) : undefined,
      direccion: pos.direccion ? Number.parseFloat(pos.direccion) : undefined,
    }))

    return NextResponse.json({
      success: true,
      data: historialFormateado,
      count: historialFormateado.length,
    })
  } catch (error) {
    console.error("[GPS History Error]", error)
    return NextResponse.json({ error: "Error al obtener historial GPS" }, { status: 500 })
  }
}
