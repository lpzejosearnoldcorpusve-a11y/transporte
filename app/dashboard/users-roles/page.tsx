"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UsersTable } from "@/components/users-roles/users-table"
import { RolesTable } from "@/components/users-roles/roles-table"
import { UserFormDialog } from "@/components/users-roles/user-form-dialog"
import { RoleFormDialog } from "@/components/users-roles/role-form-dialog"

interface User {
  id: string
  email: string
  name: string
  roleId: string | null
  roleName: string | null
  active: boolean
  lastLogin: Date | null
  createdAt: Date
}

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[] | null
  createdAt: Date
}

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users")
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  // Estados para diálogos de usuarios
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Estados para diálogos de roles
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles")
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      console.error("[v0] Error fetching roles:", error)
    }
  }

  // Handlers para usuarios
  const handleCreateUser = () => {
    setSelectedUser(null)
    setUserDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setUserDialogOpen(true)
  }

  const handleSaveUser = async (user: any) => {
    try {
      const method = user.id ? "PUT" : "POST"
      const response = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })

      if (response.ok) {
        await fetchUsers()
        setUserDialogOpen(false)
      }
    } catch (error) {
      console.error("[v0] Error saving user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
    }
  }

  // Handlers para roles
  const handleCreateRole = () => {
    setSelectedRole(null)
    setRoleDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setRoleDialogOpen(true)
  }

  const handleSaveRole = async (role: any) => {
    try {
      const method = role.id ? "PUT" : "POST"
      const response = await fetch("/api/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role),
      })

      if (response.ok) {
        await fetchRoles()
        setRoleDialogOpen(false)
      }
    } catch (error) {
      console.error("[v0] Error saving role:", error)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este rol?")) return

    try {
      const response = await fetch(`/api/roles?id=${roleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchRoles()
      }
    } catch (error) {
      console.error("[v0] Error deleting role:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-green-900">Usuarios y Roles</h1>
        <Button variant="secondary" onClick={activeTab === "users" ? handleCreateUser : handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "users" ? "Nuevo Usuario" : "Nuevo Rol"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-vibrant-orange-500 text-vibrant-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Usuarios ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === "roles"
              ? "border-b-2 border-vibrant-orange-500 text-vibrant-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Roles ({roles.length})
        </button>
      </div>

      {/* Contenido */}
      <Card>
        {activeTab === "users" ? (
          <UsersTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        ) : (
          <RolesTable roles={roles} onEdit={handleEditRole} onDelete={handleDeleteRole} />
        )}
      </Card>

      {/* Diálogos */}
      <UserFormDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        user={selectedUser}
        roles={roles}
        onSave={handleSaveUser}
      />

      <RoleFormDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={selectedRole}
        onSave={handleSaveRole}
      />
    </div>
  )
}
