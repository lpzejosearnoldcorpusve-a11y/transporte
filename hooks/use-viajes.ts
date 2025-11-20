import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useViajes() {
  const { data, error, isLoading, mutate } = useSWR<any[]>("/api/viajes", fetcher, {
    refreshInterval: 5000,
  })

  return {
    viajes: data || [],
    isLoading,
    error,
    mutate,
  }
}
