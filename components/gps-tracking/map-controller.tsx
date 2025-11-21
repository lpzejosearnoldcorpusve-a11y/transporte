
"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

export function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}