/**
 * NavigationContext – tracks active folder breadcrumb for "My Documents"
 * so sidebar can show the current folder tree.
 */
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

interface NavFolder {
  id: string
  name: string
}

interface NavigationContextValue {
  docFolderPath: NavFolder[]
  setDocFolderPath: (path: NavFolder[]) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [docFolderPath, setDocFolderPath] = useState<NavFolder[]>([])
  const value = useMemo(
    () => ({ docFolderPath, setDocFolderPath }),
    [docFolderPath],
  )
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
