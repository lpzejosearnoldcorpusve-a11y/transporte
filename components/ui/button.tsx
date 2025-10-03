import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-forest-green-900 text-white hover:bg-forest-green-800 focus-visible:ring-forest-green-700":
              variant === "primary",
            "bg-vibrant-orange-500 text-white hover:bg-vibrant-orange-600 focus-visible:ring-vibrant-orange-400":
              variant === "secondary",
            "border-2 border-forest-green-900 text-forest-green-900 hover:bg-forest-green-50": variant === "outline",
            "text-forest-green-900 hover:bg-forest-green-50": variant === "ghost",
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
