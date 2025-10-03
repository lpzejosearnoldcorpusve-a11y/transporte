import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { roles } from "@/db/schema"
import { eq } from "drizzle-orm"

// GET - Obtener todos los roles
export async function GET() {
  try {
    const allRoles = await db.select().from(roles)
    return NextResponse.json(allRoles)
  } catch (error) {
    console.error("[v0] Error fetching roles:", error)
    return NextResponse.json({ error: "Error al obtener roles" }, { status: 500 })
  }
}

// POST - Crear un nuevo rol
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const newRole = await db
      .insert(roles)
      .values({
        name,
        description,
        permissions: permissions || [],
      })
      .returning()

    return NextResponse.json(newRole[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating role:", error)
    return NextResponse.json({ error: "Error al crear rol" }, { status: 500 })
  }
}

// PUT - Actualizar un rol
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, permissions } = body

    if (!id || !name) {
      return NextResponse.json({ error: "ID y nombre son requeridos" }, { status: 400 })
    }

    const updatedRole = await db
      .update(roles)
      .set({
        name,
        description,
        permissions: permissions || [],
      })
      .where(eq(roles.id, id))
      .returning()

    if (updatedRole.length === 0) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedRole[0])
  } catch (error) {
    console.error("[v0] Error updating role:", error)
    return NextResponse.json({ error: "Error al actualizar rol" }, { status: 500 })
  }
}

// DELETE - Eliminar un rol
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const deletedRole = await db.delete(roles).where(eq(roles.id, id)).returning()

    if (deletedRole.length === 0) {
      return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Rol eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting role:", error)
    return NextResponse.json({ error: "Error al eliminar rol" }, { status: 500 })
  }
}
