interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

export function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const containerSize = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const logoSize = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  }

  const textSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl p-1.5 shadow-lg transition-transform hover:scale-105",
          "bg-gradient-to-br from-orange-500 to-orange-600",
          containerSize[size],
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm"></div>
        <img 
          src="/assets/logo.jpg" 
          alt="Hidrocarburos Logo" 
          className={cn(
            "relative z-10 rounded-lg object-cover shadow-md ring-2 ring-white/30",
            logoSize[size]
          )}
        />
      </div>
      <span
        className={cn(
          "font-bold tracking-tight transition-colors",
          variant === "light" 
            ? "text-white drop-shadow-md" 
            : "text-gray-800",
          textSize[size],
        )}
      >
        Hidrocarburos
      </span>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Ejemplo de uso con diferentes fondos
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Variante Dark */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Variante Dark (Fondo Claro)
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Small:</span>
              <Logo size="sm" variant="dark" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Medium:</span>
              <Logo size="md" variant="dark" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">Large:</span>
              <Logo size="lg" variant="dark" />
            </div>
          </div>
        </div>
        
        {/* Variante Light */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Variante Light (Fondo Oscuro)
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-24">Small:</span>
              <Logo size="sm" variant="light" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-24">Medium:</span>
              <Logo size="md" variant="light" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-24">Large:</span>
              <Logo size="lg" variant="light" />
            </div>
          </div>
        </div>

        {/* En navbar simulado */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
            <Logo size="md" variant="light" />
            <div className="flex gap-6 text-white font-medium">
              <a href="#" className="hover:text-orange-100 transition-colors">Inicio</a>
              <a href="#" className="hover:text-orange-100 transition-colors">Servicios</a>
              <a href="#" className="hover:text-orange-100 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}