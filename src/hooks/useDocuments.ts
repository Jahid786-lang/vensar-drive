import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDocuments,
  searchDocuments,
  type DocumentFolder,
  type DocumentFile,
} from '@/api/documentsApi'
import { createFolder, updateFolder, deleteFolder } from '@/api/folders'
import {
  uploadFile,
  renameFile,
  moveFile,
  deleteFile,
  downloadFile,
} from '@/api/filesApi'

export const DOCUMENTS_QUERY_KEY = ['documents']
export const DOCUMENTS_SEARCH_QUERY_KEY = ['documents', 'search']

export function useDocuments(
  folderId: string | null,
  projectPath?: string | null,
  serviceId?: string | null,
) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, folderId ?? 'root', projectPath ?? 'global', serviceId ?? ''],
    queryFn: () => fetchDocuments(folderId, projectPath, serviceId),
    staleTime: 1000 * 30,
  })
}

export function useDocumentsSearch(query: string) {
  return useQuery({
    queryKey: [...DOCUMENTS_SEARCH_QUERY_KEY, query],
    queryFn: () => searchDocuments(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30,
  })
}

export function useCreateFolder(folderId: string | null, projectPath?: string | null, serviceId?: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) =>
      createFolder({
        name,
        parentId: folderId && folderId !== 'root' ? folderId : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useUpdateFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      name,
      parentId,
    }: {
      id: string
      name?: string
      parentId?: string | null
    }) => updateFolder(id, { name, parentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useDeleteFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFolder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useUploadFile(folderId: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (percent: number) => void
    }) => uploadFile(file, folderId, onProgress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
    },
  })
}

export function useRenameFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameFile(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
    },
  })
}

export function useMoveFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) =>
      moveFile(id, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
    },
  })
}

export function useDeleteFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
    },
  })
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => downloadFile(id, name),
  })
}
