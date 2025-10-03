"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Role {
  id?: string
  name: string
  description: string | null
  permissions: string[] | null
}

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSave: (role: Role) => void
}

export function RoleFormDialog({ open, onOpenChange, role, onSave }: RoleFormDialogProps) {
  const [formData, setFormData] = useState<Role>({
    name: "",
    description: null,
    permissions: [],
  })
  const [newPermission, setNewPermission] = useState("")

  useEffect(() => {
    if (role) {
      setFormData({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions || [],
      })
    } else {
      setFormData({
        name: "",
        description: null,
        permissions: [],
      })
    }
  }, [role, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addPermission = () => {
    if (newPermission.trim() && !formData.permissions?.includes(newPermission.trim())) {
      setFormData({
        ...formData,
        permissions: [...(formData.permissions || []), newPermission.trim()],
      })
      setNewPermission("")
    }
  }

  const removePermission = (permission: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions?.filter((p) => p !== permission) || [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>{role ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre del rol</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base transition-colors focus:border-forest-green-500 focus:outline-none focus:ring-2 focus:ring-forest-green-500/20"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Permisos</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Agregar permiso"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addPermission()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addPermission}>
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.permissions?.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-forest-green-100 px-3 py-1 text-sm text-forest-green-900"
                >
                  {permission}
                  <button
                    type="button"
                    onClick={() => removePermission(permission)}
                    className="ml-1 hover:text-forest-green-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary">
              {role ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
