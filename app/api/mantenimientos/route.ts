import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { mantenimientos, vehiculos } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

function toDate(value: any) {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehiculoId = searchParams.get("vehiculoId")
    const estado = searchParams.get("estado")

    let query = db.select().from(mantenimientos)
    const condiciones = []

    if (vehiculoId) condiciones.push(eq(mantenimientos.vehiculoId, vehiculoId))
    if (estado) condiciones.push(eq(mantenimientos.estado, estado))

    if (condiciones.length > 0) {
      query = query.where(and(...condiciones)) as any
    }

    const result = await query.orderBy(desc(mantenimientos.creadoEn))
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error)
    return NextResponse.json(
      { error: "Error al obtener mantenimientos", detail: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.vehiculoId) {
      return NextResponse.json(
        { error: "El campo 'vehiculoId' es obligatorio" },
        { status: 400 }
      )
    }

    const vehiculo = await db
      .select()
      .from(vehiculos)
      .where(eq(vehiculos.id, body.vehiculoId))
      .limit(1)

    if (vehiculo.length === 0) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 })
    }

    const parsedBody = {
      ...body,
      fechaInicio: toDate(body.fechaInicio),
      fechaFin: toDate(body.fechaFin),
      proximoMantenimiento: toDate(body.proximoMantenimiento),
    }

    const [nuevoMantenimiento] = await db
      .insert(mantenimientos)
      .values({
        ...parsedBody,
        estado: "en_proceso",
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      })
      .returning()

    await db
      .update(vehiculos)
      .set({ estado: "mantenimiento" })
      .where(eq(vehiculos.id, body.vehiculoId))

    return NextResponse.json(nuevoMantenimiento, { status: 201 })
  } catch (error) {
    console.error("Error al crear mantenimiento:", error)
    return NextResponse.json(
      { error: "Error al crear mantenimiento", detail: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: "El campo 'id' es obligatorio" }, { status: 400 })
    }

    const parsedData = {
      ...data,
      fechaInicio: toDate(data.fechaInicio),
      fechaFin: toDate(data.fechaFin),
      actualizadoEn: new Date(),
    }

    const [mantenimientoActualizado] = await db
      .update(mantenimientos)
      .set(parsedData)
      .where(eq(mantenimientos.id, id))
      .returning()

    if (data.estado === "completado" && mantenimientoActualizado?.vehiculoId) {
      await db
        .update(vehiculos)
        .set({ estado: "activo" })
        .where(eq(vehiculos.id, mantenimientoActualizado.vehiculoId))
    }

    return NextResponse.json(mantenimientoActualizado)
  } catch (error) {
    console.error("Error al actualizar mantenimiento:", error)
    return NextResponse.json(
      { error: "Error al actualizar mantenimiento", detail: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de mantenimiento requerido" }, { status: 400 })
    }

    const deleted = await db.delete(mantenimientos).where(eq(mantenimientos.id, id)).returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Mantenimiento no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar mantenimiento:", error)
    return NextResponse.json(
      { error: "Error al eliminar mantenimiento", detail: String(error) },
      { status: 500 }
    )
  }
}
