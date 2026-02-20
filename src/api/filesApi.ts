import { apiClient } from '@/api/client'
import { api } from '@/lib/api'
import { API_BASE } from '@/api/config'

export interface FileItem {
  id: string
  name: string
  mimeType: string
  size: number
  folderId: string | null
  uploadedAt?: string
  updatedAt?: string
}

export async function fetchFiles(folderId: string | null): Promise<FileItem[]> {
  const id = !folderId || folderId === 'root' ? undefined : folderId
  const data = await api.get<FileItem[]>(
    `/files${id ? `?folderId=${encodeURIComponent(id)}` : ''}`,
  )
  return Array.isArray(data) ? data : []
}

export async function uploadFile(
  file: File,
  folderId: string | null,
): Promise<FileItem> {
  const formData = new FormData()
  formData.append('file', file)
  if (folderId && folderId !== 'root') {
    formData.append('folderId', folderId)
  }
  const { data } = await apiClient.post<FileItem>(
    '/files/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}

export async function renameFile(id: string, name: string): Promise<FileItem> {
  return api.patch<FileItem>(`/files/${id}`, { name })
}

export async function moveFile(id: string, folderId: string | null): Promise<FileItem> {
  return api.patch<FileItem>(`/files/${id}`, { folderId })
}

export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}`)
}

export async function downloadFile(fileId: string, fileName: string): Promise<void> {
  const { getDecryptedToken } = await import('@/lib/authStorage')
  const token = getDecryptedToken()
  const base = API_BASE || ''
  const url = `${base}/files/${fileId}/download`
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Download failed')
  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.click()
  URL.revokeObjectURL(a.href)
}
