"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RutaForm } from "./ruta-form"
import type { Ruta, RutaFormData } from "@/types/ruta"

interface RutaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruta?: Ruta
  onSubmit: (data: RutaFormData) => Promise<void>
}

export function RutaFormDialog({ open, onOpenChange, ruta, onSubmit }: RutaFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ruta ? "Editar Ruta" : "Nueva Ruta"}</DialogTitle>
        </DialogHeader>
        <RutaForm ruta={ruta} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
