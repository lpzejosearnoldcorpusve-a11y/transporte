"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FichaPreview } from "./ficha-preview"

interface FichasGalleryProps {
  previews: string[]
  onRemoveFicha: (index: number) => void
}

export function FichasGallery({ previews, onRemoveFicha }: FichasGalleryProps) {
  if (previews.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Fichas subidas ({previews.length}/5)</h4>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <AnimatePresence>
          {previews.map((preview, index) => (
            <FichaPreview
              key={`${preview}-${index}`}
              preview={preview}
              index={index}
              onRemove={() => onRemoveFicha(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
