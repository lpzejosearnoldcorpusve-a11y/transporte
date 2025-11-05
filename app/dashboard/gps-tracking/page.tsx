"use client"

import dynamic from "next/dynamic";

const GpsTrackingMap = dynamic(
  () => import("@/components/gps-tracking/gps-tracking-map").then(mod => mod.GpsTrackingMap),
  { ssr: false }
);

export default function GpsTrackingPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <GpsTrackingMap />
    </div>
  )
}
