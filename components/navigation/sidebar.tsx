"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, Users, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/logo"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios y Roles",
    href: "/dashboard/users-roles",
    icon: Users,
  },
  {
    title: "Vehículos",
    href: "/dashboard/vehiculos",
    icon: Truck,
  },
  {
    title: "Ajustes",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-forest-green-900">
      <div className="flex h-16 items-center justify-center border-b border-forest-green-800 px-6">
        <Logo variant="light" />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-vibrant-orange-500 text-white"
                  : "text-gray-300 hover:bg-forest-green-800 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
