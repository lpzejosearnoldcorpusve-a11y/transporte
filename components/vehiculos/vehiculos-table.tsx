"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VehiculoStatusBadge } from "./vehiculo-status-badge"
import { VehiculoRowActions } from "./vehiculo-row-actions"
import type { Vehiculo } from "@/types/vehiculo"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown, Filter, FileDown, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface VehiculosTableProps {
  vehiculos: Vehiculo[]
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (vehiculoId: string) => void
  onView?: (vehiculo: Vehiculo) => void
}

type SortField = "placa" | "marca" | "anio" | "capacidadLitros"
type SortOrder = "asc" | "desc"

export function VehiculosTable({ vehiculos, onEdit, onDelete, onView }: VehiculosTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("placa")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [filterEstado, setFilterEstado] = useState<string[]>(["activo", "inactivo"])
  const [filterTipo, setFilterTipo] = useState<string[]>(["cisterna", "camion", "volquete"])

  // Filtrado y ordenamiento
  const filteredAndSortedVehiculos = useMemo(() => {
    let result = [...vehiculos]

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(
        (v) =>
          v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.marca?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por estado
    result = result.filter((v) => filterEstado.includes(v.estado || "activo"))

    // Filtrar por tipo
    result = result.filter((v) => filterTipo.includes(v.tipoVehiculo || "cisterna"))

    // Ordenar
    result.sort((a, b) => {
      let aVal = a[sortField] ?? ""
      let bVal = b[sortField] ?? ""

      if (typeof aVal === "string") aVal = aVal.toLowerCase()
      if (typeof bVal === "string") bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [vehiculos, searchTerm, sortField, sortOrder, filterEstado, filterTipo])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const exportToCSV = () => {
    const headers = ["Placa", "Marca", "Año", "Tipo", "Capacidad", "Estado"]
    const data = filteredAndSortedVehiculos.map((v) => [
      v.placa,
      v.marca,
      v.anio,
      v.tipoVehiculo,
      v.capacidadLitros,
      v.estado,
    ])

    const csv = [headers, ...data].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vehiculos_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por placa, marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Filtro por Estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterEstado.includes("activo")}
                onCheckedChange={(checked) => {
                  setFilterEstado(
                    checked
                      ? [...filterEstado, "activo"]
                      : filterEstado.filter((e) => e !== "activo")
                  )
                }}
              >
                Activo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterEstado.includes("inactivo")}
                onCheckedChange={(checked) => {
                  setFilterEstado(
                    checked
                      ? [...filterEstado, "inactivo"]
                      : filterEstado.filter((e) => e !== "inactivo")
                  )
                }}
              >
                Inactivo
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtro por Tipo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Truck className="h-4 w-4" />
                Tipo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterTipo.includes("cisterna")}
                onCheckedChange={(checked) => {
                  setFilterTipo(
                    checked
                      ? [...filterTipo, "cisterna"]
                      : filterTipo.filter((t) => t !== "cisterna")
                  )
                }}
              >
                Cisterna
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterTipo.includes("camion")}
                onCheckedChange={(checked) => {
                  setFilterTipo(
                    checked ? [...filterTipo, "camion"] : filterTipo.filter((t) => t !== "camion")
                  )
                }}
              >
                Camión
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterTipo.includes("volquete")}
                onCheckedChange={(checked) => {
                  setFilterTipo(
                    checked
                      ? [...filterTipo, "volquete"]
                      : filterTipo.filter((t) => t !== "volquete")
                  )
                }}
              >
                Volquete
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Exportar */}
          <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{filteredAndSortedVehiculos.length}</span> de{" "}
          <span className="font-semibold">{vehiculos.length}</span> vehículos
        </p>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>
                  <button
                    onClick={() => handleSort("placa")}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Placa
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("marca")}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Marca/Modelo
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("anio")}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Año
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("capacidadLitros")}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Capacidad (L)
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>SOAT</TableHead>
                <TableHead>ITV</TableHead>
                <TableHead>Permiso</TableHead>
                <TableHead>GPS</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedVehiculos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Truck className="h-12 w-12 text-gray-300" />
                      <p className="text-sm font-medium">No se encontraron vehículos</p>
                      <p className="text-xs">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedVehiculos.map((vehiculo, index) => (
                  <TableRow
                    key={vehiculo.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-bold text-forest-green-700">{vehiculo.placa}</TableCell>
                    <TableCell className="font-medium">{vehiculo.marca}</TableCell>
                    <TableCell>{vehiculo.anio || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="capitalize">
                        {vehiculo.tipoVehiculo || "cisterna"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {vehiculo.capacidadLitros ? `${vehiculo.capacidadLitros.toLocaleString()} L` : "-"}
                    </TableCell>
                    <TableCell>
                      <VehiculoStatusBadge date={vehiculo.vencSoat} type="soat" />
                    </TableCell>
                    <TableCell>
                      <VehiculoStatusBadge date={vehiculo.vencItv} type="itv" />
                    </TableCell>
                    <TableCell>
                      <VehiculoStatusBadge date={vehiculo.vencPermiso} type="permiso" />
                    </TableCell>
                    <TableCell>
                      {vehiculo.gpsActivo ? (
                        <Badge variant="success" className="text-xs">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={vehiculo.estado === "activo" ? "success" : "default"}>
                        {vehiculo.estado || "activo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <VehiculoRowActions
                        vehiculo={vehiculo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}