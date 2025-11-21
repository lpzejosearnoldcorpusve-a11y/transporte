"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ReporteFiltrosProps {
  onFiltrar: (filtros: any) => void
}

export function ReporteFiltros({ onFiltrar }: ReporteFiltrosProps) {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const handleFiltrar = () => {
    onFiltrar({ fechaInicio, fechaFin })
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
            <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="mt-1" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
            <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={handleFiltrar} className="bg-forest-green-700 hover:bg-forest-green-800">
            Filtrar
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
