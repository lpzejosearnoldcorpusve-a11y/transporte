interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

export function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-vibrant-orange-500",
          sizeClasses[size],
          size === "sm" ? "w-8" : size === "md" ? "w-10" : "w-12",
        )}
      >
        {/* Aquí irá tu logo desde /assets */}
        <span
          className={cn("font-bold text-white", size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg")}
        >
          H
        </span>
      </div>
      <span
        className={cn(
          "font-semibold",
          variant === "light" ? "text-white" : "text-forest-green-900",
          size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
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
