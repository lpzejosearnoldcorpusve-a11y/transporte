import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { dispositivosGps, vehiculos } from "@/db/schema"
import { eq } from "drizzle-orm"

// POST - Vincular dispositivo con vehículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dispositivoId, vehiculoId, fechaInstalacion } = body

    if (!dispositivoId || !vehiculoId) {
      return NextResponse.json({ error: "dispositivoId y vehiculoId son requeridos" }, { status: 400 })
    }

    // Verificar que el dispositivo existe
    const dispositivo = await db.query.dispositivosGps.findFirst({
      where: eq(dispositivosGps.id, dispositivoId),
    })

    if (!dispositivo) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    // Verificar que el vehículo existe
    const vehiculo = await db.query.vehiculos.findFirst({
      where: eq(vehiculos.id, vehiculoId),
    })

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }

    // Verificar que el dispositivo no esté ya vinculado
    if (dispositivo.vehiculoId) {
      return NextResponse.json({ error: "El dispositivo ya está vinculado a un vehículo" }, { status: 400 })
    }

    // Vincular dispositivo con vehículo
    const [dispositivoActualizado] = await db
      .update(dispositivosGps)
      .set({
        vehiculoId,
        fechaInstalacion: fechaInstalacion ? new Date(fechaInstalacion) : new Date(),
      })
      .where(eq(dispositivosGps.id, dispositivoId))
      .returning()

    // Actualizar vehículo con el GPS
    await db
      .update(vehiculos)
      .set({
        gpsId: dispositivo.imei,
        gpsActivo: true,
      })
      .where(eq(vehiculos.id, vehiculoId))

    return NextResponse.json({
      success: true,
      dispositivo: dispositivoActualizado,
      message: "Dispositivo vinculado correctamente",
    })
  } catch (error) {
    console.error("[Vincular Dispositivo Error]", error)
    return NextResponse.json({ error: "Error al vincular dispositivo" }, { status: 500 })
  }
}

// DELETE - Desvincular dispositivo de vehículo
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dispositivoId = searchParams.get("dispositivoId")

    if (!dispositivoId) {
      return NextResponse.json({ error: "dispositivoId es requerido" }, { status: 400 })
    }

    // Obtener dispositivo
    const dispositivo = await db.query.dispositivosGps.findFirst({
      where: eq(dispositivosGps.id, dispositivoId),
    })

    if (!dispositivo) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    // Actualizar vehículo si está vinculado
    if (dispositivo.vehiculoId) {
      await db
        .update(vehiculos)
        .set({
          gpsId: null,
          gpsActivo: false,
        })
        .where(eq(vehiculos.id, dispositivo.vehiculoId))
    }

    // Desvincular dispositivo
    const [dispositivoActualizado] = await db
      .update(dispositivosGps)
      .set({
        vehiculoId: null,
        fechaInstalacion: null,
      })
      .where(eq(dispositivosGps.id, dispositivoId))
      .returning()

    return NextResponse.json({
      success: true,
      dispositivo: dispositivoActualizado,
      message: "Dispositivo desvinculado correctamente",
    })
  } catch (error) {
    console.error("[Desvincular Dispositivo Error]", error)
    return NextResponse.json({ error: "Error al desvincular dispositivo" }, { status: 500 })
  }
}
