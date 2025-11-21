"use client"

import { motion } from "framer-motion"
import { FileText, Download, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportesHeaderProps {
  title: string
  onDescargar?: () => void
  onBulkReport?: () => void
}

export function ReportesHeader({ title, onDescargar, onBulkReport }: ReportesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-forest-green-800 to-forest-green-700 p-6 text-white shadow-lg"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-vibrant-orange-500" />
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-200">Generado el {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        {onBulkReport && (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={onBulkReport}
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Package className="h-4 w-4 mr-2" />
              Generar Lote
            </Button>
          </motion.div>
        )}
        
        {onDescargar && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onDescargar}
            className="flex items-center gap-2 rounded-lg bg-vibrant-orange-500 px-4 py-2 font-medium hover:bg-vibrant-orange-600"
          >
            <Download className="h-5 w-5" />
            Descargar PDF
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
