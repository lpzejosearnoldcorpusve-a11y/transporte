"use client"

import type { VehiculoConMantenimiento } from "@/types/mantenimiento"
import { VehiculoCard } from "./vehiculo-card"

interface VehiculosGridProps {
  vehiculos: VehiculoConMantenimiento[]
  onSelectVehiculo: (vehiculo: VehiculoConMantenimiento) => void
  selectedId?: string
}

export function VehiculosGrid({ vehiculos, onSelectVehiculo, selectedId }: VehiculosGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehiculos.map((vehiculo, index) => (
        <VehiculoCard
          key={vehiculo.id}
          vehiculo={vehiculo}
          onSelect={() => onSelectVehiculo(vehiculo)}
          isSelected={selectedId === vehiculo.id}
          index={index}
        />
      ))}
    </div>
  )
}
