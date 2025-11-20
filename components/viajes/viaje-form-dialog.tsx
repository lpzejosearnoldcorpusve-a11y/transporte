"use client"

import { useState } from "react"
import type { CreateViajeInput } from "@/types/viaje"
import { useViajeMutations } from "@/hooks/use-viaje-mutations"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ViajeForm } from "./viaje-form"
import { motion } from "framer-motion"

interface ViajeFormDialogProps {
  onSuccess?: () => void
}

export function ViajeFormDialog({ onSuccess }: ViajeFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { crearViaje } = useViajeMutations(() => {
    setOpen(false)
    onSuccess?.()
  })

  const handleSubmit = async (data: CreateViajeInput) => {
    setIsLoading(true)
    try {
      await crearViaje(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Botón fuera del Dialog - solución simple */}
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setOpen(true)}
          className="bg-vibrant-orange-500 hover:bg-vibrant-orange-600 text-white font-semibold shadow-lg hover:shadow-xl gap-2 px-6 py-2 h-auto"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Nuevo Viaje
        </Button>
      </motion.div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Viaje</DialogTitle>
            {/* Descripción como párrafo normal */}
            <p className="text-sm text-gray-600">
              Completa todos los campos para registrar un nuevo viaje de transporte
            </p>
          </DialogHeader>
          <ViajeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </>
  )
}