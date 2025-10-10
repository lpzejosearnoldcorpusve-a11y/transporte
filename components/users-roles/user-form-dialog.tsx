"use client"

import type React from "react"
import { useState, useEffect, ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Upload, User, Loader2, X } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input 
        {...props} 
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`} 
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
  error?: string
}

function Select({ label, error, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <select 
        {...props} 
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
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
  onSave: (user: UserFormData) => Promise<void>
}

interface FormErrors {
  email?: string
  name?: string
  password?: string
  roleId?: string
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
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const [errors, setErrors] = useState<FormErrors>({})

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
    setUploadError("")
    setErrors({})
  }, [user, open])

  const uploadImage = async (file: File): Promise<string> => {
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error de API:', error)
      throw new Error(error.error || 'Error al subir la imagen')
    }

    const data = await response.json()
    console.log('Imagen subida exitosamente:', data)
    
    // Manejar tanto { url } como { success, url }
    return data.url || data.secure_url
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La imagen no debe superar 5MB")
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setUploadError("Solo se permiten imágenes (JPG, PNG, GIF, etc.)")
      return
    }

    setUploadError("")
    setUploading(true)

    try {
      // Crear preview local inmediato
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Subir imagen a Cloudinary
      const imageUrl = await uploadImage(file)
      
      // Actualizar formulario con la URL de Cloudinary
      setFormData(prev => ({ ...prev, profileImage: imageUrl }))
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error al subir la imagen")
      setImagePreview("")
      setFormData(prev => ({ ...prev, profileImage: "" }))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData(prev => ({ ...prev, profileImage: "" }))
    setUploadError("")
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // Validar contraseña (solo si es nuevo usuario o si se ingresó una)
    if (!user && !formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploading) {
      setUploadError("Espera a que termine de subir la imagen")
      return
    }

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      // Preparar datos para enviar con el campo correcto para la API
      const dataToSend: any = {
        id: formData.id,
        email: formData.email.trim().toLowerCase(),
        name: formData.name.trim(),
        roleId: formData.roleId,
        active: formData.active,
        profileImageUrl: formData.profileImage, // ✅ Cambiar nombre del campo
      }

      // Si es edición y no se cambió la contraseña, no enviarla
      if (user && !formData.password) {
        delete dataToSend.password
      } else if (formData.password) {
        dataToSend.password = formData.password
      }

      await onSave(dataToSend)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al guardar usuario:", error)
      // El error se maneja en el componente padre
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>
            <span className="text-xl font-semibold">
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Sección de imagen */}
          <div className="flex flex-col items-center space-y-3 pb-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              
              {imagePreview && !uploading && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                  title="Eliminar imagen"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              
              <label className={`absolute bottom-0 right-0 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'} text-white rounded-full p-2 shadow-lg transition`}>
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Click para subir imagen (máx 5MB)</p>
            {uploadError && (
              <p className="text-xs text-red-500 text-center">{uploadError}</p>
            )}
          </div>

          {/* Campos del formulario */}
          <Input
            label="Nombre completo"
            type="text"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            placeholder="Ej: Juan Pérez"
            error={errors.name}
            disabled={saving}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, email: e.target.value })
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            placeholder="correo@ejemplo.com"
            error={errors.email}
            disabled={saving}
          />

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {user ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
                placeholder={user ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                disabled={saving}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                disabled={saving}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
          </div>

          <Select
            label="Rol"
            value={formData.roleId || ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, roleId: e.target.value || null })}
            disabled={saving}
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
            disabled={saving}
          >
            <option value="true">✓ Activo</option>
            <option value="false">✗ Inactivo</option>
          </Select>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={saving || uploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                user ? "Actualizar" : "Crear"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}