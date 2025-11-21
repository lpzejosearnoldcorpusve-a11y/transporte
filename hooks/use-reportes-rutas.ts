import useSWR from "swr"
import type { ReporteRuta, ReporteConfig } from "@/types/reportes"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useReportesRutas(config?: ReporteConfig) {
  const queryParams = new URLSearchParams()

  if (config?.fechaInicio) queryParams.append("fechaInicio", config.fechaInicio)
  if (config?.fechaFin) queryParams.append("fechaFin", config.fechaFin)
  if (config?.filtros?.estado) queryParams.append("estado", config.filtros.estado)

  const { data, error, isLoading, mutate } = useSWR<{ reportes: ReporteRuta[] }>(
    `/api/reportes/rutas?${queryParams}`,
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
