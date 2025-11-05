"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DispositivoCard } from "./dispositivo-card"
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"
import { Loader2 } from "lucide-react"

interface DispositivosGridProps {
  dispositivos: DispositivoConVehiculo[]
  isLoading: boolean
  onVincular: (dispositivo: DispositivoConVehiculo) => void
  onDesvincular: (dispositivo: DispositivoConVehiculo) => void
  onConfig: (dispositivo: DispositivoConVehiculo) => void
}

export function DispositivosGrid({
  dispositivos,
  isLoading,
  onVincular,
  onDesvincular,
  onConfig,
}: DispositivosGridProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-green-600" />
      </div>
    )
  }

  if (dispositivos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No hay dispositivos GPS registrados</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {dispositivos.map((dispositivo) => (
          <DispositivoCard
            key={dispositivo.id}
            dispositivo={dispositivo}
            onVincular={onVincular}
            onDesvincular={onDesvincular}
            onConfig={onConfig}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
