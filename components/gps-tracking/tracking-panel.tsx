"use client"

import { motion, AnimatePresence } from "framer-motion"
import { VehicleInfoCard } from "./vehicle-info-card"
import { TrackingStats } from "./tracking-stats"
import type { VehiculoTracking } from "@/types/gps-tracking"
import { Truck, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TrackingPanelProps {
  vehiculos: VehiculoTracking[]
  selectedVehiculo: VehiculoTracking | null
  onVehiculoSelect: (vehiculo: VehiculoTracking) => void
  isLoading: boolean
}

export function TrackingPanel({ vehiculos, selectedVehiculo, onVehiculoSelect, isLoading }: TrackingPanelProps) {
  return (
    <div className="absolute right-4 top-4 z-[1000] flex max-h-[calc(100vh-8rem)] w-80 flex-col gap-4">
      {/* Estadísticas */}
      <TrackingStats vehiculos={vehiculos} />

      {/* Lista de vehículos */}
      <Card className="flex max-h-96 flex-col overflow-hidden bg-white shadow-xl">
        <div className="border-b border-gray-200 bg-forest-green-900 p-4">
          <div className="flex items-center gap-2 text-white">
            <Truck className="h-5 w-5" />
            <h3 className="font-semibold">Vehículos Activos</h3>
            <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-vibrant-orange-500 text-xs font-bold">
              {vehiculos.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && vehiculos.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Activity className="mr-2 h-5 w-5 animate-spin" />
              Cargando...
            </div>
          ) : vehiculos.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No hay vehículos con GPS activo</div>
          ) : (
            <div className="space-y-2">
              {vehiculos.map((vehiculo) => (
                <motion.button
                  key={vehiculo.vehiculo.id}
                  onClick={() => onVehiculoSelect(vehiculo)}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                    selectedVehiculo?.vehiculo.id === vehiculo.vehiculo.id
                      ? "border-vibrant-orange-500 bg-vibrant-orange-50"
                      : "border-gray-200 bg-white hover:border-forest-green-300 hover:bg-forest-green-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-forest-green-900">{vehiculo.vehiculo.placa}</p>
                      <p className="text-xs text-gray-600">{vehiculo.vehiculo.marca}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-vibrant-orange-600">
                        {vehiculo.posicion.velocidad?.toFixed(0) || "0"} km/h
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(vehiculo.posicion.timestamp).toLocaleTimeString("es-BO")}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Información detallada del vehículo seleccionado */}
      <AnimatePresence>{selectedVehiculo && <VehicleInfoCard vehiculo={selectedVehiculo} />}</AnimatePresence>
    </div>
  )
}
