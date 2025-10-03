import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-forest-green-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">Bienvenido al sistema de gestión de transporte de hidrocarburos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Panel Principal</CardTitle>
            <CardDescription>Vista general del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Aquí se mostrará el contenido del dashboard</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Métricas importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gráficos y datos estadísticos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas operaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Historial de actividades</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
