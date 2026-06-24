import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { gastos, viajes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { checkPermissionAPI, notAuthenticated, permissionDenied } from "@/lib/permission-utils"
import { PERMISSIONS } from "@/lib/permissions"

// GET - Obtener todos los gastos
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.GASTOS_VIEW)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para ver gastos")
    }

    const allGastos = await db.select().from(gastos)
    return NextResponse.json(allGastos)
  } catch (error) {
    console.error("Error fetching gastos:", error)
    return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 })
  }
}

// POST - Crear nuevo gasto
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.GASTOS_CREATE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para crear gastos")
    }

    const body = await request.json()
    const {
      tipoGasto,
      monto,
      moneda = "BOB",
      descripcion,
      fecha,
      referenciaFactura,
      imagenComprobanteUrl,
      viajeId,
    } = body

    // Validaciones básicas
    if (!tipoGasto || !monto || !fecha) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar que el viaje existe si se proporciona viajeId
    if (viajeId) {
      const viaje = await db.select().from(viajes).where(eq(viajes.id, viajeId)).limit(1)
      if (viaje.length === 0) {
        return NextResponse.json({ error: "Viaje no encontrado" }, { status: 400 })
      }
    }

    const newGasto = await db
      .insert(gastos)
      .values({
        tipoGasto,
        monto: parseFloat(monto.toString()),
        moneda,
        descripcion: descripcion || null,
        fecha: new Date(fecha),
        referenciaFactura: referenciaFactura || null,
        imagenComprobanteUrl: imagenComprobanteUrl || null,
        viajeId: viajeId || null,
      })
      .returning()

    return NextResponse.json(newGasto[0], { status: 201 })
  } catch (error) {
    console.error("Error creating gasto:", error)
    return NextResponse.json({ error: "Error al crear gasto" }, { status: 500 })
  }
}

// PUT - Actualizar gasto
export async function PUT(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.GASTOS_EDIT)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para editar gastos")
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    // Convertir datos según sea necesario
    if (updateData.fecha) {
      updateData.fecha = new Date(updateData.fecha)
    }
    if (updateData.monto) {
      updateData.monto = parseFloat(updateData.monto.toString())
    }

    const updatedGasto = await db.update(gastos).set(updateData).where(eq(gastos.id, id)).returning()

    if (updatedGasto.length === 0) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedGasto[0])
  } catch (error) {
    console.error("Error updating gasto:", error)
    return NextResponse.json({ error: "Error al actualizar gasto" }, { status: 500 })
  }
}

// DELETE - Eliminar gasto
export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.GASTOS_DELETE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para eliminar gastos")
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const deletedGasto = await db.delete(gastos).where(eq(gastos.id, id)).returning()

    if (deletedGasto.length === 0) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Gasto eliminado exitosamente" })
  } catch (error) {
    console.error("Error deleting gasto:", error)
    return NextResponse.json({ error: "Error al eliminar gasto" }, { status: 500 })
  }
}
