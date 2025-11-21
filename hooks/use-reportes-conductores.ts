import useSWR from "swr"
import type { ReporteConductor, ReporteConfig } from "@/types/reportes"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useReportesConductores(config?: ReporteConfig) {
  const queryParams = new URLSearchParams()

  if (config?.fechaInicio) queryParams.append("fechaInicio", config.fechaInicio)
  if (config?.fechaFin) queryParams.append("fechaFin", config.fechaFin)

  const { data, error, isLoading, mutate } = useSWR<{ reportes: ReporteConductor[] }>(
    `/api/reportes/conductores?${queryParams}`,
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
