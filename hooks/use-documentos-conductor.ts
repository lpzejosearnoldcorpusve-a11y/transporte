import useSWR from "swr"
import type { DocumentoConductor } from "@/types/documento-conductor"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useDocumentosConductor(conductorId?: string) {
  const url = conductorId ? `/api/documentos-conductor?conductorId=${conductorId}` : "/api/documentos-conductor"

  const { data, error, isLoading, mutate } = useSWR<DocumentoConductor[]>(url, fetcher)

  return {
    documentos: data,
    isLoading,
    isError: error,
    mutate,
  }
}
