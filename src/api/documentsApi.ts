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
  projectPath?: string | null,
  serviceId?: string | null,
  projectId?: string | null,
): Promise<DocumentsListResponse> {
  const id = !folderId || folderId === 'root' ? null : folderId
  const params = new URLSearchParams()
  if (id) params.set('folderId', id)
  if (serviceId) params.set('serviceId', serviceId)
  if (projectId) params.set('projectId', projectId)
  if (projectPath && !projectId) params.set('path', projectPath)
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

export async function searchDocuments(
  q: string,
  serviceId?: string | null,
  projectId?: string | null,
): Promise<DocumentsSearchResponse> {
  const params = new URLSearchParams({ q })
  if (serviceId) params.set('serviceId', serviceId)
  if (projectId) params.set('projectId', projectId)
  const data = await api.get<DocumentsSearchResponse>(`/documents/search?${params.toString()}`)
  return {
    folders: data.folders ?? [],
    files: data.files ?? [],
  }
}
