import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

interface SidebarContextValue {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({
  children,
  isMobile,
}: {
  children: ReactNode
  isMobile: boolean
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      mobileOpen,
      setMobileOpen,
      isMobile,
    }),
    [sidebarOpen, mobileOpen, isMobile],
  )
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

export const SIDEBAR_WIDTH = 170
export const SIDEBAR_COLLAPSED_WIDTH = 56
export const TOP_BAR_HEIGHT = 64
