"use client"

import { UserMenu } from "@/components/common/user-menu"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-forest-green-900">Sistema de Transporte de Hidrocarburos</h1>
      </div>

      <UserMenu />
    </header>
  )
}
