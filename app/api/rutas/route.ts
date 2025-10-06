import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { rutas, vehiculos } from "@/db/schema"
import { eq } from "drizzle-orm"
import { calculateRouteDistance } from "@/lib/google-maps"

// GET - Obtener todas las rutas
export async function GET() {
  try {
    const allRutas = await db
      .select({
        ruta: rutas,
        vehiculo: vehiculos,
      })
      .from(rutas)
      .leftJoin(vehiculos, eq(rutas.vehiculoId, vehiculos.id))

    const formattedRutas = allRutas.map((item) => ({
      ...item.ruta,
      vehiculo: item.vehiculo,
    }))

    return NextResponse.json(formattedRutas)
  } catch (error) {
    console.error("Error obteniendo rutas:", error)
    return NextResponse.json({ error: "Error al obtener las rutas" }, { status: 500 })
  }
}

// POST - Crear nueva ruta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, vehiculoId, origen, destino, fechaSalida, observaciones } = body

    // Validaciones
    if (!nombre || !origen || !destino) {
      return NextResponse.json({ error: "Nombre, origen y destino son requeridos" }, { status: 400 })
    }

    // Calcular distancia y duración con Google Maps
    let distanceData
    try {
      distanceData = await calculateRouteDistance(origen, destino)
    } catch (error) {
      console.error("Error con Google Maps:", error)
      return NextResponse.json({ error: "Error al calcular la distancia con Google Maps" }, { status: 400 })
    }

    // Calcular fecha de llegada estimada
    let fechaLlegadaEstimada = null
    if (fechaSalida && distanceData.durationMinutes) {
      const salida = new Date(fechaSalida)
      fechaLlegadaEstimada = new Date(salida.getTime() + distanceData.durationMinutes * 60000)
    }

    const [newRuta] = await db
      .insert(rutas)
      .values({
        nombre,
        vehiculoId: vehiculoId || null,
        origen,
        origenLat: distanceData.origenLat.toString(),
        origenLng: distanceData.origenLng.toString(),
        destino,
        destinoLat: distanceData.destinoLat.toString(),
        destinoLng: distanceData.destinoLng.toString(),
        distanciaKm: distanceData.distanceKm.toString(),
        duracionMinutos: distanceData.durationMinutes.toString(),
        fechaSalida: fechaSalida ? new Date(fechaSalida) : null,
        fechaLlegadaEstimada,
        observaciones: observaciones || null,
        estado: "planificada",
      })
      .returning()

    return NextResponse.json(newRuta, { status: 201 })
  } catch (error) {
    console.error("Error creando ruta:", error)
    return NextResponse.json({ error: "Error al crear la ruta" }, { status: 500 })
  }
}

// PUT - Actualizar ruta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID de ruta es requerido" }, { status: 400 })
    }

    // Si se actualizan origen o destino, recalcular con Google Maps
    if (updateData.origen || updateData.destino) {
      const [existingRuta] = await db.select().from(rutas).where(eq(rutas.id, id)).limit(1)

      if (!existingRuta) {
        return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 })
      }

      const origen = updateData.origen || existingRuta.origen
      const destino = updateData.destino || existingRuta.destino

      try {
        const distanceData = await calculateRouteDistance(origen, destino)

        updateData.origenLat = distanceData.origenLat.toString()
        updateData.origenLng = distanceData.origenLng.toString()
        updateData.destinoLat = distanceData.destinoLat.toString()
        updateData.destinoLng = distanceData.destinoLng.toString()
        updateData.distanciaKm = distanceData.distanceKm.toString()
        updateData.duracionMinutos = distanceData.durationMinutes.toString()

        // Recalcular fecha de llegada estimada
        if (updateData.fechaSalida || existingRuta.fechaSalida) {
          const salida = new Date(updateData.fechaSalida || existingRuta.fechaSalida)
          updateData.fechaLlegadaEstimada = new Date(salida.getTime() + distanceData.durationMinutes * 60000)
        }
      } catch (error) {
        console.error("Error recalculando distancia:", error)
      }
    }

    const [updatedRuta] = await db.update(rutas).set(updateData).where(eq(rutas.id, id)).returning()

    if (!updatedRuta) {
      return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedRuta)
  } catch (error) {
    console.error("Error actualizando ruta:", error)
    return NextResponse.json({ error: "Error al actualizar la ruta" }, { status: 500 })
  }
}

// DELETE - Eliminar ruta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de ruta es requerido" }, { status: 400 })
    }

    await db.delete(rutas).where(eq(rutas.id, id))

    return NextResponse.json({ message: "Ruta eliminada exitosamente" })
  } catch (error) {
    console.error("Error eliminando ruta:", error)
    return NextResponse.json({ error: "Error al eliminar la ruta" }, { status: 500 })
  }
}
