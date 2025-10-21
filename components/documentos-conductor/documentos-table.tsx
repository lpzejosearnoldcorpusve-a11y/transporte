"use client"

import { type DocumentoConductor, TIPOS_DOCUMENTO_LABELS } from "@/types/documento-conductor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ImageIcon, FileText, File, CheckCircle, XCircle, Eye } from "lucide-react"
import { DocumentoRowActions } from "./documento-row-actions"
import { Button } from "@/components/ui/button"

interface DocumentosTableProps {
  documentos: DocumentoConductor[]
  onView: (documento: DocumentoConductor) => void
  onEdit: (documento: DocumentoConductor) => void
  onDelete: (id: string) => void
  onValidate: (id: string) => void
}

export function DocumentosTable({ documentos, onView, onEdit, onDelete, onValidate }: DocumentosTableProps) {
  const getFileIcon = (tipoArchivo: string) => {
    if (tipoArchivo.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (tipoArchivo === "application/pdf") return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Archivo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha Emisión</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Subido</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No hay documentos registrados
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((documento) => (
              <TableRow key={documento.id}>
                <TableCell>
                  <Badge variant="default">
                    {TIPOS_DOCUMENTO_LABELS[documento.tipoDocumento as keyof typeof TIPOS_DOCUMENTO_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(documento.tipoArchivo)}
                    <span className="text-sm">{documento.nombreArchivo}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{documento.descripcion || "-"}</TableCell>
                <TableCell>
                  {documento.fechaEmision
                    ? format(new Date(documento.fechaEmision), "dd/MM/yyyy", { locale: es })
                    : "-"}
                </TableCell>
                <TableCell>
                  {documento.fechaVencimiento
                    ? format(new Date(documento.fechaVencimiento), "dd/MM/yyyy", { locale: es })
                    : "-"}
                </TableCell>
                <TableCell>
                  {documento.validado ? (
                    <Badge variant="success" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Validado
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      <XCircle className="mr-1 h-3 w-3" />
                      Pendiente
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(documento.creadoEn), "dd/MM/yyyy", { locale: es })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(documento)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DocumentoRowActions
                      documento={documento}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onValidate={onValidate}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}