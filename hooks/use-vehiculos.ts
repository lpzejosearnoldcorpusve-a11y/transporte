"use client"

import { useState, useEffect } from "react"

interface Vehiculo {
  id: string
  placa: string
  marca: string
  anio: string | null
  tipoVehiculo: string | null
  capacidadLitros: string | null
  combustible: string | null
  chasis: string | null
  nroSoat: string | null
  vencSoat: Date | null
  nroItv: string | null
  vencItv: Date | null
  nroPermiso: string | null
  vencPermiso: Date | null
  gpsId: string | null
  gpsActivo: boolean | null
  estado: string | null
  creadoEn: Date
}

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehiculos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/vehiculos")

      if (!response.ok) {
        throw new Error("Error al cargar vehículos")
      }

      const data = await response.json()
      setVehiculos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  return {
    vehiculos,
    loading,
    error,
    refetch: fetchVehiculos,
  }
}
