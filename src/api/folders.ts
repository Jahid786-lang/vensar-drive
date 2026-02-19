import { api } from '@/lib/api'
import { buildFolderTree, type FlatFolder, type FolderNode } from '@/types/folder'

/** Backend API: folders list (flat). Real backend pe yehi endpoint use karna. */
const FOLDERS_ENDPOINT = '/folders'

export async function fetchFolders(): Promise<FlatFolder[]> {
  const data = await api.get<FlatFolder[]>(FOLDERS_ENDPOINT)
  return Array.isArray(data) ? data : []
}

/**
 * Mock data – jab backend ready na ho. Backend ready hone pe fetchFolders() use karo.
 * Structure: Irrigation > Projects > Kayampur > Civil/Mechanical/Electrical/Automation > Automation > ...
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

/** Tree ke liye: flat fetch karke buildFolderTree() chalana. Backend fail = caller catch karke mock use kare. */
export async function fetchFolderTree(): Promise<FolderNode[]> {
  const flat = await fetchFolders()
  return buildFolderTree(flat)
}

/** Backend: new folder create. POST /folders { parentId, name }. */
export async function createFolder(payload: {
  parentId: string
  name: string
}): Promise<FlatFolder> {
  const data = await api.post<FlatFolder>(FOLDERS_ENDPOINT, payload)
  return data
}
