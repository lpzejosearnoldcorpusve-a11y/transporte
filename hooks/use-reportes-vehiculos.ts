import useSWR from "swr"
import type { ReporteVehiculo, ReporteConfig } from "@/types/reportes"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useReportesVehiculos(config?: ReporteConfig) {
  const queryParams = new URLSearchParams()

  if (config?.filtros?.estado) queryParams.append("estado", config.filtros.estado)

  const { data, error, isLoading, mutate } = useSWR<{ reportes: ReporteVehiculo[] }>(
    `/api/reportes/vehiculos?${queryParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  )

  return {
    reportes: data?.reportes || [],
    isLoading,
    error,
    mutate,
  }
}
