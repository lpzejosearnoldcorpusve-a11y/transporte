import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { gpsTracking, dispositivosGps } from "@/db/schema"
import { eq } from "drizzle-orm"

// POST - Recibir datos del dispositivo GPS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitud, longitud, satelites, altitud, imei, velocidad, direccion } = body

    if (!latitud || !longitud || !imei) {
      return NextResponse.json({ error: "Faltan datos requeridos: latitud, longitud, imei" }, { status: 400 })
    }

    // Buscar dispositivo por IMEI
    const dispositivo = await db.query.dispositivosGps.findFirst({
      where: eq(dispositivosGps.imei, imei),
    })

    if (!dispositivo) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    // Actualizar última señal del dispositivo
    await db
      .update(dispositivosGps)
      .set({
        ultimaSenal: new Date(),
        ultimaLatitud: latitud.toString(),
        ultimaLongitud: longitud.toString(),
        conectado: true,
      })
      .where(eq(dispositivosGps.id, dispositivo.id))

    // Si el dispositivo está vinculado a un vehículo, guardar tracking
    if (dispositivo.vehiculoId) {
      const [nuevaPosicion] = await db
        .insert(gpsTracking)
        .values({
          vehiculoId: dispositivo.vehiculoId,
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
    }

    return NextResponse.json({
      success: true,
      message: "Señal recibida pero dispositivo no vinculado a vehículo",
    })
  } catch (error) {
    console.error("[GPS Track Error]", error)
    return NextResponse.json({ error: "Error al registrar posición GPS" }, { status: 500 })
  }
}
