"use client"

import type React from "react"
import { useState, useEffect, ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Upload, User } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input {...props} className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
}

function Select({ label, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <select {...props} className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
        {children}
      </select>
    </div>
  )
}

interface UserFormData {
  id?: string
  email: string
  name: string
  password?: string
  roleId: string | null
  active: boolean
  profileImage?: string
}

interface Role {
  id: string
  name: string
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserFormData | null
  roles: Role[]
  onSave: (user: UserFormData) => void
}

export function UserFormDialog({ open, onOpenChange, user, roles, onSave }: UserFormDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    name: "",
    password: "",
    roleId: null,
    active: true,
    profileImage: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        active: user.active,
        password: "",
        profileImage: user.profileImage || "",
      })
      setImagePreview(user.profileImage || "")
    } else {
      setFormData({
        email: "",
        name: "",
        password: "",
        roleId: null,
        active: true,
        profileImage: "",
      })
      setImagePreview("")
    }
    setShowPassword(false)
  }, [user, open])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, profileImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="text-xl font-semibold">
            <DialogTitle>
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center space-y-3 pb-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Click para subir imagen</p>
          </div>

          <Input
            label="Nombre completo"
            type="text"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Juan Pérez"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@ejemplo.com"
            required
          />

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {user ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                placeholder={user ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                required={!user}
                className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Select
            label="Rol"
            value={formData.roleId || ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, roleId: e.target.value || null })}
          >
            <option value="">Sin rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>

          <Select
            label="Estado"
            value={formData.active ? "true" : "false"}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, active: e.target.value === "true" })}
          >
            <option value="true">✓ Activo</option>
            <option value="false">✗ Inactivo</option>
          </Select>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              {user ? "💾 Actualizar" : "✨ Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}