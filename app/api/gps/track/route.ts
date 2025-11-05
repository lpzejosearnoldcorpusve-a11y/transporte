import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { gpsTracking, vehiculos } from "@/db/schema"
import { eq } from "drizzle-orm"

// POST - Recibir datos del dispositivo GPS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitud, longitud, satelites, altitud, vehiculoId, velocidad, direccion } = body

    // Validar datos requeridos
    if (!latitud || !longitud || !vehiculoId) {
      return NextResponse.json({ error: "Faltan datos requeridos: latitud, longitud, vehiculoId" }, { status: 400 })
    }

    // Verificar que el vehículo existe
    const vehiculo = await db.query.vehiculos.findFirst({
      where: eq(vehiculos.id, vehiculoId),
    })

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }

    // Insertar posición GPS
    const [nuevaPosicion] = await db
      .insert(gpsTracking)
      .values({
        vehiculoId,
        latitud: latitud.toString(),
        longitud: longitud.toString(),
        altitud: altitud?.toString(),
        satelites: satelites?.toString(),
        velocidad: velocidad?.toString(),
        direccion: direccion?.toString(),
        timestamp: new Date(),
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: nuevaPosicion,
      message: "Posición GPS registrada correctamente",
    })
  } catch (error) {
    console.error("[GPS Track Error]", error)
    return NextResponse.json({ error: "Error al registrar posición GPS" }, { status: 500 })
  }
}
