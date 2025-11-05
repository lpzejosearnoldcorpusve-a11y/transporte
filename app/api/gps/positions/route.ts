import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { gpsTracking, vehiculos } from "@/db/schema"
import { desc, eq, and, gte } from "drizzle-orm"

// GET - Obtener posiciones actuales de todos los vehículos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehiculoId = searchParams.get("vehiculoId")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const since = searchParams.get("since") // timestamp para obtener solo posiciones nuevas

    // Obtener todos los vehículos con GPS activo
    const vehiculosConGps = await db.query.vehiculos.findMany({
      where: eq(vehiculos.gpsActivo, true),
    })

    // Para cada vehículo, obtener su última posición
    const posiciones = await Promise.all(
      vehiculosConGps.map(async (vehiculo) => {
        const whereConditions = [eq(gpsTracking.vehiculoId, vehiculo.id)]

        if (since) {
          whereConditions.push(gte(gpsTracking.timestamp, new Date(since)))
        }

        const ultimaPosicion = await db.query.gpsTracking.findFirst({
          where: and(...whereConditions),
          orderBy: [desc(gpsTracking.timestamp)],
        })

        if (!ultimaPosicion) return null

        return {
          vehiculo: {
            id: vehiculo.id,
            placa: vehiculo.placa,
            marca: vehiculo.marca,
            tipoVehiculo: vehiculo.tipoVehiculo,
          },
          posicion: {
            ...ultimaPosicion,
            latitud: Number.parseFloat(ultimaPosicion.latitud),
            longitud: Number.parseFloat(ultimaPosicion.longitud),
            altitud: ultimaPosicion.altitud ? Number.parseFloat(ultimaPosicion.altitud) : undefined,
            satelites: ultimaPosicion.satelites ? Number.parseInt(ultimaPosicion.satelites) : undefined,
            velocidad: ultimaPosicion.velocidad ? Number.parseFloat(ultimaPosicion.velocidad) : undefined,
            direccion: ultimaPosicion.direccion ? Number.parseFloat(ultimaPosicion.direccion) : undefined,
          },
        }
      }),
    )

    // Filtrar nulls
    const posicionesValidas = posiciones.filter((p) => p !== null)

    return NextResponse.json({
      success: true,
      data: posicionesValidas,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[GPS Positions Error]", error)
    return NextResponse.json({ error: "Error al obtener posiciones GPS" }, { status: 500 })
  }
}
