"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DispositivoForm } from "./dispositivo-form"
import type { DispositivoFormData } from "@/types/dispositivo-gps"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu } from "lucide-react"

interface DispositivoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: DispositivoFormData) => Promise<void>
}

export function DispositivoFormDialog({ open, onOpenChange, onSubmit }: DispositivoFormDialogProps) {
  const handleSubmit = async (data: DispositivoFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-green-100"
            >
              <Cpu className="h-6 w-6 text-forest-green-600" />
            </motion.div>
            <div>
              <div className="text-2xl">
                <DialogTitle>Registrar Nuevo Dispositivo GPS</DialogTitle>
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                Ingresa la información del dispositivo GPS para registrarlo en el sistema
              </div>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DispositivoForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
