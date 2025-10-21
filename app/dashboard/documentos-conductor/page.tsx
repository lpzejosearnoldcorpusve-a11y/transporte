"use client"

import { useState } from "react"
import { useDocumentosConductor } from "@/hooks/use-documentos-conductor"
import { useDocumentoConductorMutations } from "@/hooks/use-documento-conductor-mutations"
import { DocumentosTable } from "@/components/documentos-conductor/documentos-table"
import { DocumentoUploadDialog } from "@/components/documentos-conductor/documento-upload-dialog"
import { DocumentoViewer } from "@/components/documentos-conductor/documento-viewer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { DocumentoConductor } from "@/types/documento-conductor"
import { Select } from "@/components/ui/select" // Solo importa tu Select personalizado
import { Label } from "@/components/ui/label"
import { useConductores } from "@/hooks/use-conductores"

export default function DocumentosConductorPage() {
  const [selectedConductorId, setSelectedConductorId] = useState<string>("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedDocumento, setSelectedDocumento] = useState<DocumentoConductor | null>(null)

  const { conductores } = useConductores()
  const { documentos, mutate } = useDocumentosConductor(selectedConductorId === "all" ? undefined : selectedConductorId)
  const { uploadDocumento, updateDocumento, deleteDocumento } = useDocumentoConductorMutations()

  const handleUpload = async (formData: FormData) => {
    await uploadDocumento(formData)
    mutate()
  }

  const handleView = (documento: DocumentoConductor) => {
    setSelectedDocumento(documento)
    setViewerOpen(true)
  }

  const handleEdit = (documento: DocumentoConductor) => {
    // TODO: Implementar edición
    console.log("Edit:", documento)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
      await deleteDocumento(id)
      mutate()
    }
  }

  const handleValidate = async (id: string) => {
    await updateDocumento(id, { validado: true, fechaValidacion: new Date() })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentos de Conductor</h1>
          <p className="text-muted-foreground">Gestiona todos los documentos de los conductores</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} disabled={selectedConductorId === "all"}>
          <Plus className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <div className="w-64">
        <Label>Filtrar por Conductor</Label>
        <Select
          value={selectedConductorId}
          onChange={(e) => setSelectedConductorId(e.target.value)}
        >
          <option value="all">Todos los conductores</option>
          {conductores?.map((conductor) => (
            <option key={conductor.id} value={conductor.id}>
              {conductor.nombre} {conductor.apellido}
            </option>
          ))}
        </Select>
      </div>

      {documentos && (
        <DocumentosTable
          documentos={documentos}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onValidate={handleValidate}
        />
      )}

      {selectedConductorId !== "all" && (
        <DocumentoUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          conductorId={selectedConductorId}
          onUpload={handleUpload}
        />
      )}

      <DocumentoViewer open={viewerOpen} onOpenChange={setViewerOpen} documento={selectedDocumento} />
    </div>
  )
}