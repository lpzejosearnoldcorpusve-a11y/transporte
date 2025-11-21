import useSWR from "swr"
import type { ReporteGPS, ReporteConfig } from "@/types/reportes"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useReportesGPS(config?: ReporteConfig) {
  const queryParams = new URLSearchParams()

  if (config?.fechaInicio) queryParams.append("fechaInicio", config.fechaInicio)
  if (config?.fechaFin) queryParams.append("fechaFin", config.fechaFin)

  const { data, error, isLoading, mutate } = useSWR<{ reportes: ReporteGPS[] }>(
    `/api/reportes/gps?${queryParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  )

  return {
    reportes: data?.reportes || [],
    isLoading,
    error,
    mutate,
  }
}
