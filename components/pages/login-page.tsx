"use client"

import { LoginForm } from "@/components/forms/login-form"
import { Logo } from "@/components/common/logo"

export function LoginPage() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
          50% { opacity: 0.6; box-shadow: 0 0 40px rgba(251, 146, 60, 0.6); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes draw-line {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes particle-float {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }

        .icon-float-1 { animation: float 4s ease-in-out infinite; }
        .icon-float-2 { animation: float 5s ease-in-out infinite 0.5s; }
        .icon-float-3 { animation: float 4.5s ease-in-out infinite 1s; }
        .icon-float-4 { animation: float 5.5s ease-in-out infinite 1.5s; }
        .icon-float-5 { animation: float 6s ease-in-out infinite 2s; }
        .icon-float-6 { animation: float 4.8s ease-in-out infinite 2.5s; }
      `}</style>

      <div className="flex min-h-screen">
        {/* Panel izquierdo - Branding */}
        <div className="hidden w-1/2 bg-forest-green-900 lg:flex lg:flex-col lg:justify-center lg:px-12 relative overflow-hidden">
          {/* Grid de fondo */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Blobs fluidos animados */}
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-600/20 blur-3xl" style={{ animation: 'blob 8s ease-in-out infinite' }} />
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/30 blur-3xl" style={{ animation: 'blob 10s ease-in-out infinite 2s' }} />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-600/20 blur-3xl" style={{ animation: 'blob 12s ease-in-out infinite 4s' }} />

          {/* Líneas horizontales animadas */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-[20%] h-px w-full bg-gradient-to-r from-transparent via-white to-transparent" style={{ animation: 'slide 4s linear infinite' }} />
            <div className="absolute top-[40%] h-px w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" style={{ animation: 'slide 5s linear infinite 1s' }} />
            <div className="absolute top-[60%] h-px w-full bg-gradient-to-r from-transparent via-white to-transparent" style={{ animation: 'slide 6s linear infinite 2s' }} />
            <div className="absolute top-[80%] h-px w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" style={{ animation: 'slide 4.5s linear infinite 3s' }} />
          </div>

          {/* Iconos flotantes - Camiones */}
          <div className="absolute left-[10%] top-[15%] icon-float-1">
            <svg className="h-8 w-8 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>

          {/* Fuel icon */}
          <div className="absolute right-[15%] top-[20%] icon-float-2">
            <svg className="h-8 w-8 text-orange-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          {/* Map pin */}
          <div className="absolute left-[15%] bottom-[25%] icon-float-3">
            <svg className="h-8 w-8 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Shield */}
          <div className="absolute right-[12%] bottom-[20%] icon-float-4">
            <svg className="h-8 w-8 text-orange-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Chart */}
          <div className="absolute left-[50%] top-[10%] icon-float-5">
            <svg className="h-8 w-8 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>

          {/* Zap */}
          <div className="absolute right-[30%] top-[50%] icon-float-6">
            <svg className="h-8 w-8 text-orange-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Círculos decorativos giratorios */}
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full border border-white/10" style={{ animation: 'rotate-slow 20s linear infinite' }}>
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-orange-400" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
          </div>

          <div className="absolute left-10 bottom-10 h-24 w-24 rounded-full border border-orange-400/20" style={{ animation: 'rotate-slow 15s linear infinite reverse' }}>
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white" style={{ animation: 'pulse-glow 2s ease-in-out infinite 1s' }} />
          </div>

          {/* Partículas flotantes */}
          {[
            { left: 15, top: 20, tx: 50, ty: -80, duration: 5, delay: 0 },
            { left: 85, top: 15, tx: -60, ty: 70, duration: 6, delay: 0.5 },
            { left: 25, top: 80, tx: 80, ty: -50, duration: 7, delay: 1 },
            { left: 70, top: 75, tx: -40, ty: 90, duration: 5.5, delay: 1.5 },
            { left: 40, top: 30, tx: -70, ty: -60, duration: 6.5, delay: 2 },
            { left: 60, top: 55, tx: 90, ty: 40, duration: 7.5, delay: 2.5 },
            { left: 10, top: 50, tx: 60, ty: 80, duration: 6, delay: 3 },
            { left: 90, top: 40, tx: -80, ty: -70, duration: 5, delay: 3.5 },
            { left: 35, top: 65, tx: 50, ty: -90, duration: 6.5, delay: 0.8 },
            { left: 75, top: 25, tx: -50, ty: 60, duration: 7, delay: 1.2 },
            { left: 20, top: 90, tx: 70, ty: -40, duration: 5.5, delay: 2.8 },
            { left: 80, top: 60, tx: -90, ty: 50, duration: 6, delay: 3.2 }
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `particle-float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.3,
                // Add custom CSS variables using type assertion
                ...({
                  '--tx': `${particle.tx}px`,
                  '--ty': `${particle.ty}px`,
                } as React.CSSProperties & Record<string, any>)
              }}
            />
          ))}

          {/* Líneas de borde superior e inferior con glow */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }} />
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" style={{ animation: 'pulse-glow 3s ease-in-out infinite 1.5s' }} />

          {/* Contenido principal */}
          <div className="mx-auto max-w-md relative z-10">
            <Logo variant="light" size="lg" />
            <h1 className="mt-8 text-4xl font-bold text-white">Sistema de Gestión de Transporte</h1>
            <p className="mt-4 text-lg text-gray-300">
              Plataforma integral para la gestión y monitoreo de transporte de hidrocarburos
            </p>

            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-sm font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Monitoreo en tiempo real</h3>
                  <p className="text-sm text-gray-400">Seguimiento completo de todas las operaciones</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-sm font-bold text-white">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Gestión eficiente</h3>
                  <p className="text-sm text-gray-400">Optimiza recursos y rutas de transporte</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibrant-orange-500 transition-transform group-hover:scale-110 group-hover:rotate-3">
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
        <div className="flex w-full items-center justify-center px-6 lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50">
          {/* Decoración sutil de fondo */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-orange-100 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-gray-100 to-transparent blur-3xl" />
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="mb-8 lg:hidden">
              <Logo variant="dark" size="md" />
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </>
  )
}