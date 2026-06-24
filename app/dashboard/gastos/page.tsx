"use client"

import { PermissionGuard } from "@/components/permission-guard"
import { GastosDashboard } from "@/components/gastos/gastos-dashboard"
import { PERMISSIONS } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function GastosPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.GASTOS_VIEW}>
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-forest-green-900">Gastos</h1>
            <p className="text-gray-600">
              Panel analítico de gastos operativos
            </p>
          </div>
          <Link href="/dashboard/facturas">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Ver Facturas
            </Button>
          </Link>
        </motion.div>

        {/* Dashboard */}
        <GastosDashboard />
      </div>
    </PermissionGuard>
  )
}
