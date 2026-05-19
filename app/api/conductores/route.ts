import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { conductores } from "@/db/schema"
import { eq } from "drizzle-orm"
import { checkPermissionAPI, notAuthenticated, permissionDenied } from "@/lib/permission-utils"
import { PERMISSIONS } from "@/lib/permissions"

// GET - Obtener todos los conductores
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.CONDUCTORES_VIEW)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para ver conductores")
    }

    const allConductores = await db.select().from(conductores)
    return NextResponse.json(allConductores)
  } catch (error) {
    console.error("Error fetching conductores:", error)
    return NextResponse.json({ error: "Error al obtener conductores" }, { status: 500 })
  }
}

// POST - Crear nuevo conductor
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.CONDUCTORES_CREATE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para crear conductores")
    }

    const body = await request.json()
    const { nombre, apellido, ci, licencia, categoria, vencimientoLicencia, telefono, direccion } = body

    // Validaciones básicas
    if (!nombre || !apellido || !ci || !licencia || !categoria || !vencimientoLicencia) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si ya existe un conductor con ese CI
    const existingConductor = await db.select().from(conductores).where(eq(conductores.ci, ci)).limit(1)

    if (existingConductor.length > 0) {
      return NextResponse.json({ error: "Ya existe un conductor con ese CI" }, { status: 400 })
    }

    const newConductor = await db
      .insert(conductores)
      .values({
        nombre,
        apellido,
        ci,
        licencia,
        categoria,
        vencimientoLicencia: new Date(vencimientoLicencia),
        telefono: telefono || null,
        direccion: direccion || null,
      })
      .returning()

    return NextResponse.json(newConductor[0], { status: 201 })
  } catch (error) {
    console.error("Error creating conductor:", error)
    return NextResponse.json({ error: "Error al crear conductor" }, { status: 500 })
  }
}

// PUT - Actualizar conductor
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.CONDUCTORES_EDIT)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para editar conductores")
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    // Si se actualiza la fecha de vencimiento, convertirla a Date
    if (updateData.vencimientoLicencia) {
      updateData.vencimientoLicencia = new Date(updateData.vencimientoLicencia)
    }

    const updatedConductor = await db.update(conductores).set(updateData).where(eq(conductores.id, id)).returning()

    if (updatedConductor.length === 0) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedConductor[0])
  } catch (error) {
    console.error("Error updating conductor:", error)
    return NextResponse.json({ error: "Error al actualizar conductor" }, { status: 500 })
  }
}

// DELETE - Eliminar conductor
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const authCheck = await checkPermissionAPI(request, PERMISSIONS.CONDUCTORES_DELETE)

    if (!authCheck.allowed) {
      return authCheck.error === "No autenticado"
        ? notAuthenticated()
        : permissionDenied("No tienes permiso para eliminar conductores")
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const deletedConductor = await db.delete(conductores).where(eq(conductores.id, id)).returning()

    if (deletedConductor.length === 0) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Conductor eliminado exitosamente" })
  } catch (error) {
    console.error("Error deleting conductor:", error)
    return NextResponse.json({ error: "Error al eliminar conductor" }, { status: 500 })
  }
}
