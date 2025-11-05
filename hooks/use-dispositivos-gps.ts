import useSWR from "swr"
import type { DispositivoConVehiculo } from "@/types/dispositivo-gps"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useDispositivosGps() {
  const { data, error, isLoading, mutate } = useSWR<DispositivoConVehiculo[]>(
    "/api/dispositivos-gps?includeVehiculo=true",
    fetcher,
    {
      refreshInterval: 5000, // Actualizar cada 5 segundos
    },
  )

  return {
    dispositivos: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
