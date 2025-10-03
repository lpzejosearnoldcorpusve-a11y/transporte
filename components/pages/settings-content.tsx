import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-forest-green-900">Ajustes</h2>
        <p className="mt-2 text-gray-600">Configura las preferencias del sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>Ajustes básicos del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Opciones de configuración general</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Información personal y credenciales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gestión de perfil y seguridad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Preferencias de alertas y notificaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Configuración de notificaciones</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
