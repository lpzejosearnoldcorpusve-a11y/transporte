"use client"

import { motion } from "framer-motion"
import { X, ZoomIn } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface FichaPreviewProps {
  preview: string
  index: number
  onRemove: () => void
}

export function FichaPreview({ preview, index, onRemove }: FichaPreviewProps) {
  const [showZoom, setShowZoom] = useState(false)

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-vibrant-orange-500 transition-all"
      >
        <img
          src={preview || "/placeholder.svg"}
          alt={`Ficha ${index + 1}`}
          className="h-40 w-full object-cover cursor-pointer"
          onClick={() => setShowZoom(true)}
        />

        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setShowZoom(true)}
            className="rounded-full bg-white p-2 text-forest-green-600 hover:bg-gray-100 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Número de ficha */}
        <div className="absolute left-2 top-2 rounded-full bg-forest-green-600 px-2 py-1 text-xs font-bold text-white">
          #{index + 1}
        </div>
      </motion.div>

      {/* Modal de zoom */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-4xl">
          <img
            src={preview || "/placeholder.svg"}
            alt={`Ficha ${index + 1} - Vista ampliada`}
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
