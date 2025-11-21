"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import useSWR from "swr"

// Componentes modulares del dashboard
import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis"
import { DashboardEstadoFlota } from "@/components/dashboard/dashboard-estado-flota"
import { DashboardViajesCurso } from "@/components/dashboard/dashboard-viajes-curso"
import { DashboardAlertasGraficos } from "@/components/dashboard/dashboard-alertas-graficos"
import { DashboardActividadReciente } from "@/components/dashboard/dashboard-actividad-reciente"

// Crear el componente de mapa dinámicamente para evitar errores de SSR
import dynamic from "next/dynamic"
const DashboardMapaVivo = dynamic(
  () => import("@/components/dashboard/dashboard-mapa-vivo").then((mod) => ({ default: mod.DashboardMapaVivo })),
  { ssr: false }
)

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Types
type DashboardData = {
  stats: {
    vehiculosActivos: number
    viajesHoy: number
    viajesEnTransito: number
    conductoresActivos: number
    mantenimientosEnProceso: number
    alertasGps: number
  }
  estadoFlota: {
    items: Array<{
      name: string
      value: number
      color: string
    }>
    total: number
  }
  viajesPorDia: Array<{
    fecha: string
    viajes: number
  }>
  litrosPorProducto: Array<{
    producto: string
    litros: number
  }>
  alertas: Array<{
    tipo: string
    count: number
    icon: string
    color: string
  }>
  actividadReciente: Array<{
    tipo: string
    descripcion: string
    tiempo: string
    icon: string
  }>
}

type ViajeEnTransito = {
  id: string
  numeroViaje: string
  vehiculoId: string
  conductorId: string
  producto: string
  cantidad: number
  lugarCarga: string
  lugarDescarga: string
  estado: string
  vehiculo: {
    id: string
    placa: string
    marca: string
  } | null
  conductor: {
    id: string
    nombre: string
    apellido: string
  } | null
}

type VehiculoTracking = {
  vehiculo: {
    id: string
    placa: string
    marca: string
  }
  posicion: {
    latitud: number
    longitud: number
    velocidad: number
    altitud: number
    satelites: number
    timestamp: string
  }
  ultimaPosicion: {
    id: string
    vehiculoId: string
    latitud: number
    longitud: number
    velocidad: number
    timestamp: string
  }
}

export function DashboardContent() {
  const { data: dashboardData, error: dashboardError, mutate: refetchDashboard } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher,
    { 
      refreshInterval: 30000, // Actualizar cada 30 segundos
      revalidateOnFocus: true
    }
  )

  const { data: viajesData, error: viajesError } = useSWR<ViajeEnTransito[]>(
    '/api/viajes-en-transito',
    fetcher,
    { 
      refreshInterval: 60000, // Actualizar cada minuto
      revalidateOnFocus: true
    }
  )

  const { data: trackingData, error: trackingError, mutate: refetchTracking } = useSWR<VehiculoTracking[]>(
    '/api/vehiculos-tracking',
    fetcher,
    { 
      refreshInterval: 30000, // Actualizar cada 30 segundos
      revalidateOnFocus: true
    }
  )

  const handleRefreshTracking = () => {
    refetchTracking()
  }

  const handleRefreshDashboard = () => {
    refetchDashboard()
  }

  const handleVerMapa = (viaje: any) => {
    // TODO: Implementar navegación al mapa del viaje específico
    console.log('Ver mapa del viaje:', viaje.id)
  }

  const handleVerRuta = (viaje: any) => {
    // TODO: Implementar navegación a la hoja de ruta
    console.log('Ver ruta del viaje:', viaje.id)
  }

  const dashboardLoading = !dashboardData && !dashboardError
  const viajesLoading = !viajesData && !viajesError
  const trackingLoading = !trackingData && !trackingError

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (dashboardError || viajesError || trackingError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el dashboard</h2>
          <p className="text-gray-600">Hubo un problema al obtener los datos. Inténtalo de nuevo.</p>
          <button
            onClick={handleRefreshDashboard}
            className="mt-4 px-4 py-2 bg-vibrant-orange-500 text-white rounded-lg hover:bg-vibrant-orange-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Los datos ya vienen directamente de las APIs REST
  const dashboard = dashboardData
  // Asegurar compatibilidad de tipos
  const viajesEnTransito = (viajesData || []).map(viaje => ({
    ...viaje,
    vehiculo: viaje.vehiculo || undefined,
    conductor: viaje.conductor || undefined
  }))
  const vehiculosTracking = trackingData || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-forest-green-900">Dashboard Principal</h1>
          <p className="mt-2 text-gray-600">Vista general en tiempo real del sistema de transporte</p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {format(new Date(), "HH:mm:ss", { locale: es })}
        </div>
      </motion.div>

      {/* KPIs Principales */}
      {dashboard?.stats && (
        <DashboardKPIs stats={dashboard.stats} />
      )}

      {/* Estado de la Flota y Mapa */}
      <div className="grid gap-6 lg:grid-cols-2">
        {dashboard?.estadoFlota && (
          <DashboardEstadoFlota estadoFlota={dashboard.estadoFlota} />
        )}

        <DashboardMapaVivo
          vehiculosTracking={vehiculosTracking}
          isLoading={trackingLoading}
          onRefresh={handleRefreshTracking}
        />
      </div>

      {/* Viajes en Curso */}
      <DashboardViajesCurso
        viajesEnTransito={viajesEnTransito}
        onVerMapa={handleVerMapa}
        onVerRuta={handleVerRuta}
      />

      {/* Alertas y Gráficos */}
      {dashboard && (
        <DashboardAlertasGraficos
          alertas={dashboard.alertas}
          viajesPorDia={dashboard.viajesPorDia}
          litrosPorProducto={dashboard.litrosPorProducto}
        />
      )}

      {/* Actividad Reciente */}
      {dashboard?.actividadReciente && (
        <DashboardActividadReciente actividadReciente={dashboard.actividadReciente} />
      )}
    </div>
  )
}
