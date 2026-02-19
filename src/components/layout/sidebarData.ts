/** Categories in the sidebar dropdown: Civil, Mechanical, Electrical, Automation */
export const SIDEBAR_CATEGORIES = [
  { id: 'civil', label: 'Civil', path: '/civil', colorKey: 'success.main' as const },
  { id: 'mechanical', label: 'Mechanical', path: '/mechanical', colorKey: 'info.main' as const },
  { id: 'electrical', label: 'Electrical', path: '/electrical', colorKey: 'secondary.main' as const },
  { id: 'automation', label: 'Automation', path: '/automation', colorKey: 'secondary.dark' as const },
] as const

export type CategoryId = (typeof SIDEBAR_CATEGORIES)[number]['id']

/** User-created folder inside a category (like Google Drive) */
export interface UserFolder {
  id: string
  name: string
  parentId: CategoryId
}

export function createUserFolder(name: string, parentId: CategoryId): UserFolder {
  return {
    id: `uf-${parentId}-${crypto.randomUUID().slice(0, 8)}`,
    name,
    parentId,
  }
}
