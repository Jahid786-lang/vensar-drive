import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDocuments,
  searchDocuments,
  type DocumentFolder,
  type DocumentFile,
} from '@/api/documentsApi'
import {
  createFolder,
  updateFolder,
  deleteFolder,
  deleteFolderRecursive,
  ensureProjectRootFolder,
} from '@/api/folders'
import {
  uploadFile,
  renameFile,
  moveFile,
  deleteFile,
  downloadFile,
} from '@/api/filesApi'

export { type DocumentFolder, type DocumentFile }

export const DOCUMENTS_QUERY_KEY = ['documents']
export const DOCUMENTS_SEARCH_QUERY_KEY = ['documents', 'search']

export function useDocuments(
  folderId: string | null,
  projectPath?: string | null,
  serviceId?: string | null,
  projectId?: string | null,
) {
  return useQuery({
    queryKey: [
      ...DOCUMENTS_QUERY_KEY,
      folderId ?? 'root',
      serviceId ?? '',
      projectId ?? '',
      projectPath ?? '',
    ],
    queryFn: () => fetchDocuments(folderId, projectPath, serviceId, projectId),
    staleTime: 1000 * 30,
  })
}

export function useDocumentsSearch(
  query: string,
  serviceId?: string | null,
  projectId?: string | null,
) {
  return useQuery({
    queryKey: [...DOCUMENTS_SEARCH_QUERY_KEY, query, serviceId ?? '', projectId ?? ''],
    queryFn: () => searchDocuments(query, serviceId, projectId),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30,
  })
}

export function useCreateFolder(
  serviceId?: string | null,
  projectId?: string | null,
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      createFolder({
        name,
        parentId,
        serviceId: serviceId || null,
        projectId: projectId || null,
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

export function useDeleteFolderRecursive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFolderRecursive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useEnsureProjectRoot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      serviceId,
      projectId,
    }: {
      serviceId: string
      projectId: string
    }) => ensureProjectRootFolder(serviceId, projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useUploadFile(
  serviceId?: string | null,
  projectId?: string | null,
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      file,
      folderId,
      onProgress,
    }: {
      file: File
      folderId: string | null
      onProgress?: (percent: number) => void
    }) => uploadFile(
      file,
      folderId,
      onProgress,
      serviceId,
      projectId,
    ),
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
