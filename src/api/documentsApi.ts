import { api } from '@/lib/api'

export interface DocumentFolder {
  id: string
  name: string
  parentId: string | null
  path: string
  order?: number
  createdAt?: string
  updatedAt?: string
  childrenCount?: number
  type: 'folder'
}

export interface DocumentFile {
  id: string
  name: string
  mimeType: string
  size: number
  folderId: string | null
  uploadedAt?: string
  updatedAt?: string
  type: 'file'
}

export interface DocumentsListResponse {
  rootFolder?: { id: string; name: string; path: string } | null
  folders: DocumentFolder[]
  files: DocumentFile[]
}

export interface DocumentsSearchResponse {
  folders: DocumentFolder[]
  files: DocumentFile[]
}

export async function fetchDocuments(
  folderId: string | null,
  /** Path for project view: /serviceId/projectId e.g. /irrigation/kayampur-sitamau */
  projectPath?: string | null,
  /** Service ID for validation - ensures folder belongs to this service */
  serviceId?: string | null,
): Promise<DocumentsListResponse> {
  const id = !folderId || folderId === 'root' ? 'root' : folderId
  const params = new URLSearchParams()
  if (id !== 'root') params.set('folderId', id)
  if (projectPath) params.set('path', projectPath)
  if (serviceId) params.set('serviceId', serviceId)
  const qs = params.toString()
  const data = await api.get<DocumentsListResponse>(
    `/documents${qs ? `?${qs}` : ''}`,
  )
  return {
    rootFolder: data.rootFolder ?? null,
    folders: data.folders ?? [],
    files: data.files ?? [],
  }
}

export async function searchDocuments(q: string): Promise<DocumentsSearchResponse> {
  const data = await api.get<DocumentsSearchResponse>(
    `/documents/search?q=${encodeURIComponent(q)}`,
  )
  return {
    folders: data.folders ?? [],
    files: data.files ?? [],
  }
}
