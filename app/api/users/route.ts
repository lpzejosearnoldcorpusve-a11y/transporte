import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, roles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword } from "@/lib/auth"

// GET - Obtener todos los usuarios con sus roles
export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        roleId: users.roleId,
        profileImage: users.profileImage, // solo URL
        active: users.active,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, roleId, profileImageUrl } = body // solo URL

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, nombre y contraseña son requeridos" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
        roleId,
        profileImage: profileImageUrl || null, // guardamos solo URL
        active: true,
      })
      .returning()

    const { password: _, ...userWithoutPassword } = newUser[0]

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

// PUT - Actualizar un usuario
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name, password, roleId, profileImageUrl, active } = body

    if (!id || !email || !name) {
      return NextResponse.json({ error: "ID, email y nombre son requeridos" }, { status: 400 })
    }

    const updateData: any = {
      email,
      name,
      roleId,
      profileImage: profileImageUrl || null, // solo URL
      active,
    }

    if (password) {
      updateData.password = await hashPassword(password)
    }

    const updatedUser = await db.update(users).set(updateData).where(eq(users.id, id)).returning()

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = updatedUser[0]

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning()

    if (deletedUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuario eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
