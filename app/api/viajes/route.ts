import { db } from "@/db/index"
import { viajes, vehiculos, conductores } from "@/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const allViajes = await db
      .select()
      .from(viajes)
      .leftJoin(vehiculos, eq(viajes.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(viajes.conductorId, conductores.id))

    // Transformar la estructura de datos
    const transformedViajes = allViajes.map(item => ({
      ...item.viajes, // Spread de las propiedades del viaje
      vehiculos: item.vehiculos, // Objeto completo del vehículo
      conductores: item.conductores // Objeto completo del conductor
    }))

    console.log("📊 [API] Viajes transformados:", transformedViajes.length)
    if (transformedViajes.length > 0) {
      console.log("📋 [API] Primer viaje:", {
        id: transformedViajes[0].id,
        numeroViaje: transformedViajes[0].numeroViaje,
        tieneVehiculo: !!transformedViajes[0].vehiculos,
        tieneConductor: !!transformedViajes[0].conductores
      })
    }

    return NextResponse.json(transformedViajes)
  } catch (error) {
    console.error("[v0] Error fetching viajes:", error)
    return NextResponse.json({ error: "Error fetching viajes" }, { status: 500 })
  }
}

// ... el resto de tus funciones POST, PUT, DELETE se mantienen igual
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const viaje = await db
      .insert(viajes)
      .values({
        ...body,
        fechaInicio: new Date(body.fechaInicio),
        fechaEstimadaLlegada: body.fechaEstimadaLlegada ? new Date(body.fechaEstimadaLlegada) : null,
      })
      .returning()

    return NextResponse.json(viaje[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating viaje:", error)
    return NextResponse.json({ error: "Error creating viaje" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const updatedViaje = await db
      .update(viajes)
      .set({
        ...data,
        actualizadoEn: new Date(),
      })
      .where(eq(viajes.id, id))
      .returning()

    return NextResponse.json(updatedViaje[0])
  } catch (error) {
    console.error("[v0] Error updating viaje:", error)
    return NextResponse.json({ error: "Error updating viaje" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await db.delete(viajes).where(eq(viajes.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting viaje:", error)
    return NextResponse.json({ error: "Error deleting viaje" }, { status: 500 })
  }
}