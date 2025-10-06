import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { vehiculos } from "@/db/schema"
import { eq } from "drizzle-orm"

// GET - Obtener todos los vehículos
export async function GET() {
  try {
    const allVehiculos = await db.select().from(vehiculos).orderBy(vehiculos.creadoEn)

    return NextResponse.json(allVehiculos)
  } catch (error) {
    console.error("Error fetching vehiculos:", error)
    return NextResponse.json({ error: "Error al obtener vehículos" }, { status: 500 })
  }
}

// POST - Crear nuevo vehículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.placa || !body.marca) {
      return NextResponse.json({ error: "Placa y marca son requeridos" }, { status: 400 })
    }

    // Verificar si la placa ya existe
    const existingVehiculo = await db.select().from(vehiculos).where(eq(vehiculos.placa, body.placa)).limit(1)

    if (existingVehiculo.length > 0) {
      return NextResponse.json({ error: "La placa ya está registrada" }, { status: 400 })
    }

    // Crear vehículo
    const newVehiculo = await db
      .insert(vehiculos)
      .values({
        placa: body.placa,
        marca: body.marca,
        anio: body.anio || null,
        tipoVehiculo: body.tipoVehiculo || "cisterna",
        capacidadLitros: body.capacidadLitros || null,
        combustible: body.combustible || "diésel",
        chasis: body.chasis || null,
        nroSoat: body.nroSoat || null,
        vencSoat: body.vencSoat ? new Date(body.vencSoat) : null,
        nroItv: body.nroItv || null,
        vencItv: body.vencItv ? new Date(body.vencItv) : null,
        nroPermiso: body.nroPermiso || null,
        vencPermiso: body.vencPermiso ? new Date(body.vencPermiso) : null,
        gpsId: body.gpsId || null,
        gpsActivo: body.gpsActivo || false,
        estado: body.estado || "activo",
      })
      .returning()

    return NextResponse.json(newVehiculo[0], { status: 201 })
  } catch (error) {
    console.error("Error creating vehiculo:", error)
    return NextResponse.json({ error: "Error al crear vehículo" }, { status: 500 })
  }
}

// PUT - Actualizar vehículo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    // Verificar si el vehículo existe
    const existingVehiculo = await db.select().from(vehiculos).where(eq(vehiculos.id, body.id)).limit(1)

    if (existingVehiculo.length === 0) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }

    // Si se está cambiando la placa, verificar que no exista
    if (body.placa && body.placa !== existingVehiculo[0].placa) {
      const placaExists = await db.select().from(vehiculos).where(eq(vehiculos.placa, body.placa)).limit(1)

      if (placaExists.length > 0) {
        return NextResponse.json({ error: "La placa ya está registrada" }, { status: 400 })
      }
    }

    // Actualizar vehículo
    const updatedVehiculo = await db
      .update(vehiculos)
      .set({
        placa: body.placa,
        marca: body.marca,
        anio: body.anio || null,
        tipoVehiculo: body.tipoVehiculo,
        capacidadLitros: body.capacidadLitros || null,
        combustible: body.combustible,
        chasis: body.chasis || null,
        nroSoat: body.nroSoat || null,
        vencSoat: body.vencSoat ? new Date(body.vencSoat) : null,
        nroItv: body.nroItv || null,
        vencItv: body.vencItv ? new Date(body.vencItv) : null,
        nroPermiso: body.nroPermiso || null,
        vencPermiso: body.vencPermiso ? new Date(body.vencPermiso) : null,
        gpsId: body.gpsId || null,
        gpsActivo: body.gpsActivo,
        estado: body.estado,
        actualizadoEn: new Date(),
      })
      .where(eq(vehiculos.id, body.id))
      .returning()

    return NextResponse.json(updatedVehiculo[0])
  } catch (error) {
    console.error("Error updating vehiculo:", error)
    return NextResponse.json({ error: "Error al actualizar vehículo" }, { status: 500 })
  }
}

// DELETE - Eliminar vehículo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    await db.delete(vehiculos).where(eq(vehiculos.id, id))

    return NextResponse.json({ message: "Vehículo eliminado exitosamente" })
  } catch (error) {
    console.error("Error deleting vehiculo:", error)
    return NextResponse.json({ error: "Error al eliminar vehículo" }, { status: 500 })
  }
}
