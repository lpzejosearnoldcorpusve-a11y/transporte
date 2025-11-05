import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { dispositivosGps, vehiculos } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

// GET - Obtener todos los dispositivos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeVehiculo = searchParams.get("includeVehiculo") === "true"

    if (includeVehiculo) {
      // Obtener dispositivos con información del vehículo
      const dispositivos = await db
        .select({
          id: dispositivosGps.id,
          imei: dispositivosGps.imei,
          modelo: dispositivosGps.modelo,
          fabricante: dispositivosGps.fabricante,
          numeroSerie: dispositivosGps.numeroSerie,
          vehiculoId: dispositivosGps.vehiculoId,
          estado: dispositivosGps.estado,
          conectado: dispositivosGps.conectado,
          ultimaSenal: dispositivosGps.ultimaSenal,
          ultimaLatitud: dispositivosGps.ultimaLatitud,
          ultimaLongitud: dispositivosGps.ultimaLongitud,
          intervaloReporte: dispositivosGps.intervaloReporte,
          alertaVelocidad: dispositivosGps.alertaVelocidad,
          alertaCombustible: dispositivosGps.alertaCombustible,
          fechaInstalacion: dispositivosGps.fechaInstalacion,
          fechaActivacion: dispositivosGps.fechaActivacion,
          observaciones: dispositivosGps.observaciones,
          creadoEn: dispositivosGps.creadoEn,
          actualizadoEn: dispositivosGps.actualizadoEn,
          vehiculo: {
            id: vehiculos.id,
            placa: vehiculos.placa,
            marca: vehiculos.marca,
          },
        })
        .from(dispositivosGps)
        .leftJoin(vehiculos, eq(dispositivosGps.vehiculoId, vehiculos.id))
        .orderBy(desc(dispositivosGps.creadoEn))

      return NextResponse.json(dispositivos)
    }

    // Obtener solo dispositivos
    const dispositivos = await db.query.dispositivosGps.findMany({
      orderBy: (dispositivos, { desc }) => [desc(dispositivos.creadoEn)],
    })

    return NextResponse.json(dispositivos)
  } catch (error) {
    console.error("[Dispositivos GPS GET Error]", error)
    return NextResponse.json({ error: "Error al obtener dispositivos" }, { status: 500 })
  }
}

// POST - Crear nuevo dispositivo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imei,
      modelo,
      fabricante,
      numeroSerie,
      intervaloReporte,
      alertaVelocidad,
      alertaCombustible,
      observaciones,
    } = body

    if (!imei) {
      return NextResponse.json({ error: "El IMEI es requerido" }, { status: 400 })
    }

    // Verificar que el IMEI no exista
    const existente = await db.query.dispositivosGps.findFirst({
      where: eq(dispositivosGps.imei, imei),
    })

    if (existente) {
      return NextResponse.json({ error: "Ya existe un dispositivo con este IMEI" }, { status: 400 })
    }

    const [nuevoDispositivo] = await db
      .insert(dispositivosGps)
      .values({
        imei,
        modelo,
        fabricante,
        numeroSerie,
        intervaloReporte: intervaloReporte?.toString() || "30",
        alertaVelocidad: alertaVelocidad?.toString(),
        alertaCombustible: alertaCombustible?.toString(),
        observaciones,
        fechaActivacion: new Date(),
      })
      .returning()

    return NextResponse.json(nuevoDispositivo, { status: 201 })
  } catch (error) {
    console.error("[Dispositivos GPS POST Error]", error)
    return NextResponse.json({ error: "Error al crear dispositivo" }, { status: 500 })
  }
}

// PUT - Actualizar dispositivo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: "El ID es requerido" }, { status: 400 })
    }

    const [dispositivoActualizado] = await db
      .update(dispositivosGps)
      .set({
        ...data,
        intervaloReporte: data.intervaloReporte?.toString(),
        alertaVelocidad: data.alertaVelocidad?.toString(),
        alertaCombustible: data.alertaCombustible?.toString(),
      })
      .where(eq(dispositivosGps.id, id))
      .returning()

    if (!dispositivoActualizado) {
      return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
    }

    return NextResponse.json(dispositivoActualizado)
  } catch (error) {
    console.error("[Dispositivos GPS PUT Error]", error)
    return NextResponse.json({ error: "Error al actualizar dispositivo" }, { status: 500 })
  }
}

// DELETE - Eliminar dispositivo
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "El ID es requerido" }, { status: 400 })
    }

    await db.delete(dispositivosGps).where(eq(dispositivosGps.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Dispositivos GPS DELETE Error]", error)
    return NextResponse.json({ error: "Error al eliminar dispositivo" }, { status: 500 })
  }
}
