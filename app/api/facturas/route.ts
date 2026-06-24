import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { facturas, conductores, gastos, vehiculos, viajes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { checkPermissionAPI, notAuthenticated, permissionDenied } from "@/lib/permission-utils"
import { PERMISSIONS } from "@/lib/permissions"

// GET - Obtener todas las facturas
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.FACTURAS_VIEW)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para ver facturas")
    }

    const allFacturas = await db.select().from(facturas)
    return NextResponse.json(allFacturas)
  } catch (error) {
    console.error("Error fetching facturas:", error)
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
  }
}

// POST - Crear nueva factura
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.FACTURAS_CREATE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para crear facturas")
    }

    const body = await request.json()
    const {
      numeroFactura,
      fechaFactura,
      proveedor,
      categoria,
      archivoUrl,
      archivoNombre,
      archivoTipo,
      estado = "pendiente",
      conductorId,
      gastoId,
      vehiculoId,
      viajeId,
      datosOcr,
    } = body

    // Validaciones básicas
    if (!categoria || !archivoUrl || !archivoNombre || !archivoTipo || !fechaFactura) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar referencias
    if (conductorId) {
      const conductor = await db
        .select()
        .from(conductores)
        .where(eq(conductores.id, conductorId))
        .limit(1)
      if (conductor.length === 0) {
        return NextResponse.json({ error: "Conductor no encontrado" }, { status: 400 })
      }
    }

    if (gastoId) {
      const gasto = await db.select().from(gastos).where(eq(gastos.id, gastoId)).limit(1)
      if (gasto.length === 0) {
        return NextResponse.json({ error: "Gasto no encontrado" }, { status: 400 })
      }
    }

    if (vehiculoId) {
      const vehiculo = await db.select().from(vehiculos).where(eq(vehiculos.id, vehiculoId)).limit(1)
      if (vehiculo.length === 0) {
        return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 400 })
      }
    }

    if (viajeId) {
      const viaje = await db.select().from(viajes).where(eq(viajes.id, viajeId)).limit(1)
      if (viaje.length === 0) {
        return NextResponse.json({ error: "Viaje no encontrado" }, { status: 400 })
      }
    }

    const newFactura = await db
      .insert(facturas)
      .values({
        numeroFactura: numeroFactura || null,
        fechaFactura: new Date(fechaFactura),
        proveedor: proveedor || null,
        categoria,
        archivoUrl,
        archivoNombre,
        archivoTipo,
        estado,
        conductorId: conductorId || null,
        gastoId: gastoId || null,
        vehiculoId: vehiculoId || null,
        viajeId: viajeId || null,
        datosOcr: datosOcr ? JSON.stringify(datosOcr) : null,
      })
      .returning()

    return NextResponse.json(newFactura[0], { status: 201 })
  } catch (error) {
    console.error("Error creating factura:", error)
    return NextResponse.json({ error: "Error al crear factura" }, { status: 500 })
  }
}

// PUT - Actualizar factura
export async function PUT(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.FACTURAS_EDIT)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para editar facturas")
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    // Convertir fecha si se proporciona
    if (updateData.fechaFactura) {
      updateData.fechaFactura = new Date(updateData.fechaFactura)
    }

    const updatedFactura = await db
      .update(facturas)
      .set(updateData)
      .where(eq(facturas.id, id))
      .returning()

    if (updatedFactura.length === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedFactura[0])
  } catch (error) {
    console.error("Error updating factura:", error)
    return NextResponse.json({ error: "Error al actualizar factura" }, { status: 500 })
  }
}

// DELETE - Eliminar factura
export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.FACTURAS_DELETE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para eliminar facturas")
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const deletedFactura = await db.delete(facturas).where(eq(facturas.id, id)).returning()

    if (deletedFactura.length === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Factura eliminada exitosamente" })
  } catch (error) {
    console.error("Error deleting factura:", error)
    return NextResponse.json({ error: "Error al eliminar factura" }, { status: 500 })
  }
}
