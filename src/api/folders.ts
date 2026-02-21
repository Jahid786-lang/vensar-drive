import { api } from '@/lib/api'
import { buildFolderTree, type FlatFolder, type FolderNode } from '@/types/folder'

/** Backend API: folders list (flat). */
const FOLDERS_ENDPOINT = '/folders'

export async function fetchFolders(): Promise<FlatFolder[]> {
  const data = await api.get<FlatFolder[]>(FOLDERS_ENDPOINT)
  return Array.isArray(data) ? data : []
}

/**
 * Mock data – when backend is not ready.
 * Structure: Irrigation > Projects > Kayampur > Civil/Mechanical/Electrical/Automation > ...
 */
export function getMockFlatFolders(): FlatFolder[] {
  return [
    { id: 'irrigation', name: 'Irrigation', parentId: null, path: '/irrigation', order: 1 },
    { id: 'irrigation-projects', name: 'Projects', parentId: 'irrigation', path: '/irrigation/projects', order: 1 },
    { id: 'kayampur', name: 'Kayampur', parentId: 'irrigation-projects', path: '/irrigation/projects/kayampur', order: 1 },
    { id: 'kayampur-civil', name: 'Civil', parentId: 'kayampur', path: '/irrigation/projects/kayampur/civil', order: 1 },
    { id: 'kayampur-mechanical', name: 'Mechanical', parentId: 'kayampur', path: '/irrigation/projects/kayampur/mechanical', order: 2 },
    { id: 'kayampur-electrical', name: 'Electrical', parentId: 'kayampur', path: '/irrigation/projects/kayampur/electrical', order: 3 },
    { id: 'kayampur-automation', name: 'Automation', parentId: 'kayampur', path: '/irrigation/projects/kayampur/automation', order: 4 },
    { id: 'automation-docs', name: 'Documents 2024', parentId: 'kayampur-automation', path: '/irrigation/projects/kayampur/automation/documents-2024', order: 1 },
    { id: 'automation-drawings', name: 'Drawings', parentId: 'kayampur-automation', path: '/irrigation/projects/kayampur/automation/drawings', order: 2 },
  ]
}

/** Build tree from flat list. On backend failure, caller can use mock. */
export async function fetchFolderTree(): Promise<FolderNode[]> {
  const flat = await fetchFolders()
  return buildFolderTree(flat)
}

/** Backend: new folder create. POST /folders { parentId?, name, serviceId?, projectId? }. */
export async function createFolder(payload: {
  parentId?: string | null
  name: string
  serviceId?: string | null
  projectId?: string | null
}): Promise<FlatFolder> {
  const data = await api.post<FlatFolder>(FOLDERS_ENDPOINT, payload)
  return data
}

/** Backend: rename or move folder. PATCH /folders/:id */
export async function updateFolder(
  id: string,
  payload: { name?: string; parentId?: string | null },
): Promise<FlatFolder> {
  const data = await api.patch<FlatFolder>(`${FOLDERS_ENDPOINT}/${id}`, payload)
  return data
}

/** Backend: delete folder (shallow). DELETE /folders/:id */
export async function deleteFolder(id: string): Promise<void> {
  await api.delete(`${FOLDERS_ENDPOINT}/${id}`)
}

/** Backend: recursively delete folder + all children + files. DELETE /folders/:id/recursive */
export async function deleteFolderRecursive(id: string): Promise<{ foldersDeleted: number; filesDeleted: number }> {
  return api.delete<{ foldersDeleted: number; filesDeleted: number }>(`${FOLDERS_ENDPOINT}/${id}/recursive`)
}

/** Ensure project root folder exists. POST /folders/ensure-root */
export async function ensureProjectRootFolder(serviceId: string, projectId: string): Promise<FlatFolder> {
  return api.post<FlatFolder>(`${FOLDERS_ENDPOINT}/ensure-root`, { serviceId, projectId })
}
