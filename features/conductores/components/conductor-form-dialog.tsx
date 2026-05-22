"use client"

import type { Conductor, ConductorFormData } from "@/types/conductor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConductorForm } from "./conductor-form"

interface ConductorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conductor?: Conductor | null
  onSubmit: (data: ConductorFormData) => void
  loading?: boolean
}

export function ConductorFormDialog({ open, onOpenChange, conductor, onSubmit, loading }: ConductorFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{conductor ? "Editar Conductor" : "Nuevo Conductor"}</DialogTitle>
        </DialogHeader>
        <ConductorForm
          conductor={conductor}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
