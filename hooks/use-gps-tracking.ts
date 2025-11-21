"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import type { VehiculoTracking } from "@/types/gps-tracking"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useGpsTracking(refreshInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: VehiculoTracking[]
    timestamp: string
  }>("/api/gps/positions", fetcher, {
    refreshInterval,
    revalidateOnFocus: true,
  })

  return {
    vehiculos: data?.data || [],
    isLoading,
    error,
    mutate,
    lastUpdate: data?.timestamp,
  }
}

export function useGpsHistory(vehiculoId: string | null, desde?: string, hasta?: string) {
  const params = new URLSearchParams()
  if (vehiculoId) params.append("vehiculoId", vehiculoId)
  if (desde) params.append("desde", desde)
  if (hasta) params.append("hasta", hasta)

  const { data, error, isLoading } = useSWR(vehiculoId ? `/api/gps/history?${params.toString()}` : null, fetcher)

  return {
    historial: data?.data || [],
    isLoading,
    error,
    count: data?.count || 0,
  }
}