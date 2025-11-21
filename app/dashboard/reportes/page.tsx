"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportesHeader } from "@/components/reportes/reportes-header"
import { ReporteFiltros } from "@/components/reportes/reporte-filtros"
import { BulkReportGenerator } from "@/components/reportes/bulk-report-generator"

// Componentes de conductores
import { ReporteConductoresTabla } from "@/components/reportes/reporte-conductores-tabla"
import { ReporteConductoresEstadisticas } from "@/components/reportes/reporte-conductores-estadisticas"
import { useReportesConductores } from "@/hooks/use-reportes-conductores"

// Componentes de rutas
import { ReporteRutasTabla } from "@/components/reportes/reporte-rutas-tabla"
import { ReporteRutasEstadisticas } from "@/components/reportes/reporte-rutas-estadisticas"
import { useReportesRutas } from "@/hooks/use-reportes-rutas"

// Componentes de GPS
import { ReporteGPSTabla } from "@/components/reportes/reporte-gps-tabla"
import { ReporteGPSEstadisticas } from "@/components/reportes/reporte-gps-estadisticas"
import { useReportesGPS } from "@/hooks/use-reportes-gps"

// Componentes de vehículos
import { ReporteVehiculosTabla } from "@/components/reportes/reporte-vehiculos-tabla"
import { ReporteVehiculosEstadisticas } from "@/components/reportes/reporte-vehiculos-estadisticas"
import { useReportesVehiculos } from "@/hooks/use-reportes-vehiculos"

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState<"conductores" | "rutas" | "gps" | "vehiculos">("conductores")
  const [config, setConfig] = useState<any>({})
  const [showBulkGenerator, setShowBulkGenerator] = useState(false)

  // Hooks para cada tipo de reporte
  const { reportes: conductores, isLoading: loadingConductores } = useReportesConductores(config)
  const { reportes: rutas, isLoading: loadingRutas } = useReportesRutas(config)
  const { reportes: gps, isLoading: loadingGPS } = useReportesGPS(config)
  const { reportes: vehiculos, isLoading: loadingVehiculos } = useReportesVehiculos(config)

  const getActiveData = () => {
    switch (activeTab) {
      case "conductores":
        return { reportes: conductores, isLoading: loadingConductores }
      case "rutas":
        return { reportes: rutas, isLoading: loadingRutas }
      case "gps":
        return { reportes: gps, isLoading: loadingGPS }
      case "vehiculos":
        return { reportes: vehiculos, isLoading: loadingVehiculos }
      default:
        return { reportes: conductores, isLoading: loadingConductores }
    }
  }

  const handleDescargarPDF = async () => {
    const { reportes } = getActiveData()
    
    if (reportes.length === 0) {
      alert("No hay datos para exportar")
      return
    }

    try {
      const response = await fetch("/api/reportes/generar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: activeTab, reportes }),
      })

      if (!response.ok) {
        throw new Error("Error al generar PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar PDF:", error)
      alert("Error al generar el PDF. Por favor, inténtelo nuevamente.")
    }
  }

  const handleBulkReport = () => {
    setShowBulkGenerator(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <ReportesHeader 
        title="Reportes Operacionales" 
        onDescargar={handleDescargarPDF}
        onBulkReport={handleBulkReport}
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-forest-green-100">
          <TabsTrigger value="conductores">Conductores</TabsTrigger>
          <TabsTrigger value="rutas">Rutas</TabsTrigger>
          <TabsTrigger value="gps">GPS</TabsTrigger>
          <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
        </TabsList>

        <TabsContent value="conductores" className="space-y-4">
          <ReporteFiltros onFiltrar={setConfig} />
          <ReporteConductoresEstadisticas reportes={conductores} />
          <ReporteConductoresTabla reportes={conductores} isLoading={loadingConductores} />
        </TabsContent>

        <TabsContent value="rutas" className="space-y-4">
          <ReporteFiltros onFiltrar={setConfig} />
          <ReporteRutasEstadisticas reportes={rutas} />
          <ReporteRutasTabla reportes={rutas} isLoading={loadingRutas} />
        </TabsContent>

        <TabsContent value="gps" className="space-y-4">
          <ReporteFiltros onFiltrar={setConfig} />
          <ReporteGPSEstadisticas reportes={gps} />
          <ReporteGPSTabla reportes={gps} isLoading={loadingGPS} />
        </TabsContent>

        <TabsContent value="vehiculos" className="space-y-4">
          <ReporteFiltros onFiltrar={setConfig} />
          <ReporteVehiculosEstadisticas reportes={vehiculos} />
          <ReporteVehiculosTabla reportes={vehiculos} isLoading={loadingVehiculos} />
        </TabsContent>
      </Tabs>

      <BulkReportGenerator 
        isOpen={showBulkGenerator} 
        onClose={() => setShowBulkGenerator(false)} 
      />
    </motion.div>
  )
}
