import { PermissionGuard } from "@/components/permission-guard"
import { FacturasGallery } from "@/components/facturas/facturas-gallery"
import { PERMISSIONS } from "@/lib/permissions"

export default function FacturasPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.FACTURAS_VIEW}>
      <div className="container mx-auto py-8 px-4">
        <FacturasGallery />
      </div>
    </PermissionGuard>
  )
}

