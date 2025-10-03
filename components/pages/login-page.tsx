"use client"

import { LoginForm } from "@/components/forms/login-form"
import { Logo } from "@/components/common/logo"

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - Branding */}
      <div className="hidden w-1/2 bg-forest-green-900 lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div className="mx-auto max-w-md">
          <Logo variant="light" size="lg" />
          <h1 className="mt-8 text-4xl font-bold text-white">Sistema de Gestión de Transporte</h1>
          <p className="mt-4 text-lg text-gray-300">
            Plataforma integral para la gestión y monitoreo de transporte de hidrocarburos
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500">
                <span className="text-sm font-bold text-white">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Monitoreo en tiempo real</h3>
                <p className="text-sm text-gray-400">Seguimiento completo de todas las operaciones</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500">
                <span className="text-sm font-bold text-white">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Gestión eficiente</h3>
                <p className="text-sm text-gray-400">Optimiza recursos y rutas de transporte</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500">
                <span className="text-sm font-bold text-white">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Seguridad garantizada</h3>
                <p className="text-sm text-gray-400">Cumplimiento de normativas y protocolos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo variant="dark" size="md" />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
