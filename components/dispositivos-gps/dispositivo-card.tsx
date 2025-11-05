"use client"

import { motion } from "framer-motion"
import { Radio, Wifi, WifiOff, LinkIcon, Unlink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"
import { DispositivoStatusIndicator } from "./dispositivo-status-indicator"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface DispositivoCardProps {
  dispositivo: DispositivoConVehiculo
  onVincular: (dispositivo: DispositivoConVehiculo) => void
  onDesvincular: (dispositivo: DispositivoConVehiculo) => void
  onConfig: (dispositivo: DispositivoConVehiculo) => void
}

export function DispositivoCard({ dispositivo, onVincular, onDesvincular, onConfig }: DispositivoCardProps) {
  const isVinculado = !!dispositivo.vehiculoId
  const isConectado = dispositivo.conectado

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden p-6">
        {/* Indicador de conexión animado */}
        <div className="absolute right-4 top-4">
          <DispositivoStatusIndicator conectado={isConectado} />
        </div>

        {/* Icono principal */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-forest-green-100 p-3">
            <Radio className="h-6 w-6 text-forest-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{dispositivo.imei}</h3>
            <p className="text-sm text-gray-500">
              {dispositivo.fabricante} {dispositivo.modelo}
            </p>
          </div>
        </div>

        {/* Información del vehículo vinculado */}
        {isVinculado && dispositivo.vehiculo ? (
          <div className="mb-4 rounded-lg bg-vibrant-orange-50 p-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-vibrant-orange-600" />
              <div>
                <p className="text-sm font-medium text-vibrant-orange-900">Vinculado a:</p>
                <p className="text-sm text-vibrant-orange-700">
                  {dispositivo.vehiculo.placa} - {dispositivo.vehiculo.marca}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Sin vincular a vehículo</p>
          </div>
        )}

        {/* Última señal */}
        {dispositivo.ultimaSenal && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            {isConectado ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-gray-400" />}
            <span>
              Última señal:{" "}
              {formatDistanceToNow(new Date(dispositivo.ultimaSenal), {
                addSuffix: true,
                locale: es,
              })}
            </span>
          </div>
        )}

        {/* Estado */}
        <div className="mb-4">
          <Badge variant={dispositivo.estado === "activo" ? "default" : "danger"}>{dispositivo.estado}</Badge>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {isVinculado ? (
            <Button variant="outline" size="sm" onClick={() => onDesvincular(dispositivo)} className="flex-1">
              <Unlink className="mr-2 h-4 w-4" />
              Desvincular
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onVincular(dispositivo)} className="flex-1">
              <LinkIcon className="mr-2 h-4 w-4" />
              Vincular
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onConfig(dispositivo)}>
            Configurar
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
