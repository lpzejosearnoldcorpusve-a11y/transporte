"use client"

import { motion } from "framer-motion"

interface DispositivoStatusIndicatorProps {
  conectado: boolean
}

export function DispositivoStatusIndicator({ conectado }: DispositivoStatusIndicatorProps) {
  return (
    <div className="relative flex items-center gap-2">
      {/* Punto indicador */}
      <motion.div
        className={`h-3 w-3 rounded-full ${conectado ? "bg-green-500" : "bg-gray-400"}`}
        animate={
          conectado
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Ondas de señal (solo si está conectado) */}
      {conectado && (
        <>
          <motion.div
            className="absolute left-0 h-3 w-3 rounded-full bg-green-500"
            animate={{
              scale: [1, 2, 3],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute left-0 h-3 w-3 rounded-full bg-green-500"
            animate={{
              scale: [1, 2, 3],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      <span className="text-xs font-medium text-gray-600">{conectado ? "En línea" : "Desconectado"}</span>
    </div>
  )
}
