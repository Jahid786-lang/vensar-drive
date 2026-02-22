import { useState, useRef, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import Add from '@mui/icons-material/Add'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import MoreVert from '@mui/icons-material/MoreVert'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import TableChartOutlined from '@mui/icons-material/TableChartOutlined'
import SlideshowOutlined from '@mui/icons-material/SlideshowOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ChevronRight from '@mui/icons-material/ChevronRight'
import ViewListOutlined from '@mui/icons-material/ViewListOutlined'
import ViewModuleOutlined from '@mui/icons-material/ViewModuleOutlined'
import {
  useDocuments,
  useCreateFolder,
  useUploadFile,
  useRenameFile,
  useDeleteFile,
  useDeleteFolder,
  useDeleteFolderRecursive,
  useUpdateFolder,
  useDownloadFile,
} from '@/hooks/useDocuments'
import { createFolder } from '@/api/folders'
import { useFoldersFlat } from '@/hooks/useFoldersFlat'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigation } from '@/contexts/NavigationContext'
import { isAdminOrAbove } from '@/constants/roles'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { CreateFolderDialog } from './CreateFolderDialog'
import { RenameDialog } from './RenameDialog'
import type { DocumentFolder, DocumentFile } from '@/api/documentsApi'

const IMAGE_MIME_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
  'image/webp', 'image/svg+xml', 'image/bmp',
])

function isImageFile(mimeType: string): boolean {
  return IMAGE_MIME_TYPES.has(mimeType)
}

/** In-memory cache: fileId → { url, expiresAt } */
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>()

/**
 * Image thumbnail:
 * 1. Try /view-url endpoint → get presigned S3 URL (fast, no backend proxy).
 *    Caches the URL for VITE_SIGNED_URL_CACHE_MS milliseconds.
 * 2. If no S3 URL (local file) → fetch with auth and create blob URL.
 */
function ImageThumbnail({ fileId, alt }: { fileId: string; alt: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let blobUrl: string | null = null
    let cancelled = false

    ;(async () => {
      try {
        // Check cache first
        const cached = signedUrlCache.get(fileId)
        if (cached && cached.expiresAt > Date.now()) {
          if (!cancelled) setSrc(cached.url)
          return
        }

        // Step 1: try presigned S3 URL
        const { getFileViewUrl } = await import('@/api/filesApi')
        const { SIGNED_URL_CACHE_MS } = await import('@/api/config')
        const result = await getFileViewUrl(fileId)
        if (result.url && !cancelled) {
          signedUrlCache.set(fileId, {
            url: result.url,
            expiresAt: Date.now() + SIGNED_URL_CACHE_MS,
          })
          setSrc(result.url)
          return
        }
      } catch {
        // fallthrough to blob fetch
      }

      // Step 2: fallback – fetch with auth, create blob URL (local storage)
      try {
        const { getDecryptedToken } = await import('@/lib/authStorage')
        const { API_BASE } = await import('@/api/config')
        const token = getDecryptedToken()
        const res = await fetch(`${API_BASE}/files/${fileId}/download`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          redirect: 'follow',
        })
        if (!res.ok || cancelled) { setError(true); return }
        const blob = await res.blob()
        blobUrl = URL.createObjectURL(blob)
        if (!cancelled) setSrc(blobUrl)
      } catch {
        if (!cancelled) setError(true)
      }
    })()

    return () => {
      cancelled = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [fileId])

  if (error || (!src)) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <ImageOutlined sx={{ fontSize: 28, color: error ? 'error.light' : 'grey.400' }} />
      </Box>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
      onError={() => setError(true)}
    />
  )
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  'application/pdf': <PictureAsPdfOutlined sx={{ color: 'error.dark' }} />,
  'image/png': <ImageOutlined sx={{ color: 'info.main' }} />,
  'image/jpeg': <ImageOutlined sx={{ color: 'info.main' }} />,
  'image/gif': <ImageOutlined sx={{ color: 'info.main' }} />,
  'image/webp': <ImageOutlined sx={{ color: 'info.main' }} />,
  'application/vnd.ms-excel': <TableChartOutlined sx={{ color: 'success.dark' }} />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
    <TableChartOutlined sx={{ color: 'success.dark' }} />
  ),
  'application/vnd.ms-powerpoint': <SlideshowOutlined sx={{ color: 'warning.dark' }} />,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': (
    <SlideshowOutlined sx={{ color: 'warning.dark' }} />
  ),
  'application/zip': <FolderOutlined sx={{ color: 'grey.600' }} />,
}

function getFileIcon(mimeType: string) {
  return FILE_ICONS[mimeType] ?? (
    <InsertDriveFileOutlined sx={{ color: 'grey.600' }} />
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export interface FileExplorerProps {
  /** Path for project view: /serviceId/projectId e.g. /irrigation/kayampur-sitamau. Omit for My Documents (root). */
  projectPath?: string | null
  /** Service ID - ensures documents are scoped to this service only */
  serviceId?: string | null
  /** Project ID - scopes documents to this project */
  projectId?: string | null
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`
  return d.toLocaleDateString()
}

function formatDateShort(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function formatDateDisplay(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 604800000) return formatDate(iso) // within 7 days: "X days ago"
  return formatDateShort(iso) // else: "1/2/2026"
}

type ViewMode = 'list' | 'grid'

export function FileExplorer({ projectPath, serviceId, projectId: propProjectId }: FileExplorerProps = {}) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    anchor: HTMLElement
    item: DocumentFolder | DocumentFile
  } | null>(null)
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameItem, setRenameItem] = useState<DocumentFolder | DocumentFile | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DocumentFolder | DocumentFile | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ percent: number; currentFile?: string; total?: number; done?: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast()
  const { user } = useAuth()
  const { setDocFolderPath } = useNavigation()

  // Extract projectId from projectPath if not provided directly (/serviceId/projectId)
  const projectId = propProjectId ?? (projectPath ? projectPath.split('/').filter(Boolean)[1] ?? null : null)

  /** Upload/create only in project documents, and only for admin/super_admin */
  const canUpload = !!projectPath && isAdminOrAbove(user?.role)
  const { data, isLoading, error } = useDocuments(currentFolderId, projectPath, serviceId, projectId)
  const { data: foldersFlat } = useFoldersFlat()
  const createFolderMutation = useCreateFolder(serviceId, projectId)
  const uploadFileMutation = useUploadFile(serviceId, projectId)
  const renameFile = useRenameFile()
  const renameFolder = useUpdateFolder()
  const deleteFileMutation = useDeleteFile()
  const deleteFolderMutation = useDeleteFolder()
  const deleteFolderRecursiveMutation = useDeleteFolderRecursive()
  const downloadFileMutation = useDownloadFile()

  const folders = data?.folders ?? []
  const files = data?.files ?? []
  const rootFolder = data?.rootFolder ?? null

  /**
   * Effective parent folder ID for create/upload operations.
   * When at project root (currentFolderId=null), use rootFolder.id so files
   * land inside the project, not at system root.
   */
  const effectiveFolderId = currentFolderId ?? rootFolder?.id ?? null

  // Ref so handleCreateFolder always uses the latest value even if there's a re-render
  const effectiveFolderIdRef = useRef<string | null>(null)
  effectiveFolderIdRef.current = effectiveFolderId

  // Sync folder path to NavigationContext (only for My Documents, not project docs)
  useEffect(() => {
    if (!projectPath && foldersFlat) {
      if (!currentFolderId) {
        setDocFolderPath([])
        return
      }
      const map = new Map(foldersFlat.map((f) => [f.id, f]))
      const chain: { id: string; name: string }[] = []
      let curr = map.get(currentFolderId)
      while (curr) {
        chain.unshift({ id: curr.id, name: curr.name })
        curr = curr.parentId ? map.get(curr.parentId) : undefined
      }
      setDocFolderPath(chain)
    }
  }, [currentFolderId, foldersFlat, projectPath, setDocFolderPath])

  const breadcrumb = (() => {
    if (!currentFolderId) {
      if (projectPath && rootFolder) {
        return [
          { id: null, name: 'Home', path: '' },
          { id: rootFolder.id, name: rootFolder.name, path: rootFolder.path },
        ]
      }
      return [{ id: null, name: 'Home', path: '' }]
    }
    if (!foldersFlat) return [{ id: null, name: 'Home', path: '' }]
    const map = new Map(foldersFlat.map((f) => [f.id, f]))
    const chain: { id: string; name: string; path: string }[] = []
    let curr = map.get(currentFolderId)
    while (curr) {
      chain.unshift({ id: curr.id, name: curr.name, path: curr.path ?? '' })
      curr = curr.parentId ? map.get(curr.parentId) : undefined
    }
    return [{ id: null, name: 'Home', path: '' }, ...chain]
  })()

  const handleCreateFolder = async (name: string) => {
    // Use ref to get the LATEST effectiveFolderId at submit time
    const parentId = effectiveFolderIdRef.current
    await createFolderMutation.mutateAsync({ name, parentId })
    showToast('Folder created', 'success')
  }

  const handleUpload = () => {
    if (!canUpload) return
    fileInputRef.current?.click()
  }

  const handleFolderUpload = () => {
    if (!canUpload) return
    folderInputRef.current?.click()
  }

  /**
   * Upload flat list of files (no folder structure).
   */
  const processFiles = useCallback(
    async (fileList: FileList | File[], targetFolderId: string | null) => {
      const files = Array.from(fileList)
      if (!files.length || !canUpload) return
      setUploadProgress({ percent: 0, currentFile: files[0]?.name, total: files.length, done: 0 })
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]!
          setUploadProgress({
            percent: Math.round((i / files.length) * 100),
            currentFile: file.name,
            total: files.length,
            done: i,
          })
          await uploadFileMutation.mutateAsync({
            file,
            folderId: targetFolderId,
            onProgress: (p) => {
              const base = (i / files.length) * 100
              const contribution = (p / 100) * (1 / files.length) * 100
              setUploadProgress({ percent: Math.round(base + contribution), currentFile: file.name, total: files.length, done: i })
            },
          })
        }
        setUploadProgress({ percent: 100, currentFile: files[files.length - 1]?.name, total: files.length, done: files.length })
        showToast(`${files.length} file(s) uploaded`, 'success')
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
      } finally {
        setTimeout(() => setUploadProgress(null), 800)
      }
    },
    [canUpload, uploadFileMutation, showToast],
  )

  /**
   * Upload a folder with its full structure.
   * Uses webkitRelativePath to reconstruct nested folders.
   */
  const processFolderUpload = useCallback(
    async (fileList: FileList, uploadRootFolderId: string | null) => {
      if (!fileList.length || !canUpload) return
      const files = Array.from(fileList)
      if (!files.length) return

      // Map of relative directory path -> folderId
      const folderIdMap = new Map<string, string>()
      const rootFolderId = uploadRootFolderId

      setUploadProgress({ percent: 0, currentFile: 'Creating folder structure...', total: files.length, done: 0 })

      try {
        // Sort so parents come before children
        files.sort((a, b) => {
          const pa = (a.webkitRelativePath || a.name).split('/').length
          const pb = (b.webkitRelativePath || b.name).split('/').length
          return pa - pb
        })

        // First pass: create all needed folders
        const dirsSeen = new Set<string>()
        for (const file of files) {
          const relPath = file.webkitRelativePath || file.name
          const parts = relPath.split('/')
          // parts = ['FolderName', 'SubFolder', 'file.pdf']
          // We need to create folder for each directory segment
          for (let depth = 1; depth < parts.length; depth++) {
            const dirPath = parts.slice(0, depth).join('/')
            if (dirsSeen.has(dirPath)) continue
            dirsSeen.add(dirPath)

            const parentDirPath = depth === 1 ? '' : parts.slice(0, depth - 1).join('/')
            const parentId = parentDirPath ? (folderIdMap.get(parentDirPath) ?? rootFolderId) : rootFolderId
            const folderName = parts[depth - 1]!

            try {
              const newFolder = await createFolder({
                name: folderName,
                parentId: parentId,
                serviceId: serviceId || null,
                projectId: projectId || null,
              })
              folderIdMap.set(dirPath, newFolder.id)
            } catch {
              // Folder may already exist, try to find it from existing data
              const existingId = folderIdMap.get(dirPath)
              if (!existingId) {
                // Use parentId as fallback
                folderIdMap.set(dirPath, parentId ?? 'root')
              }
            }
          }
        }

        // Second pass: upload files into correct folders
        for (let i = 0; i < files.length; i++) {
          const file = files[i]!
          const relPath = file.webkitRelativePath || file.name
          const parts = relPath.split('/')
          const dirPath = parts.slice(0, parts.length - 1).join('/')
          const targetFolderId = dirPath ? (folderIdMap.get(dirPath) ?? rootFolderId) : rootFolderId

          setUploadProgress({
            percent: Math.round(((i + 1) / files.length) * 100),
            currentFile: file.name,
            total: files.length,
            done: i + 1,
          })

          await uploadFileMutation.mutateAsync({
            file,
            folderId: targetFolderId ?? null,
            onProgress: undefined,
          })
        }

        setUploadProgress({ percent: 100, total: files.length, done: files.length })
        showToast(`Folder uploaded: ${files.length} file(s)`, 'success')
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Folder upload failed', 'error')
      } finally {
        setTimeout(() => setUploadProgress(null), 800)
      }
    },
    [canUpload, uploadFileMutation, serviceId, projectId, showToast],
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    await processFiles(selected, effectiveFolderId)
    e.target.value = ''
  }

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    await processFolderUpload(selected, effectiveFolderId)
    e.target.value = ''
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!canUpload) return
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    },
    [canUpload],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      if (!canUpload) return
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      // Check if any items are directories (folder drop)
      const items = Array.from(e.dataTransfer.items ?? [])
      const hasDirectory = items.some(
        (item) => item.kind === 'file' && item.webkitGetAsEntry?.()?.isDirectory,
      )

      if (hasDirectory) {
        showToast('Folder drop not supported in all browsers. Use "Upload Folder" button.', 'info')
        return
      }

      const files = e.dataTransfer.files
      if (!files?.length) return
      await processFiles(files, effectiveFolderId)
    },
    [canUpload, processFiles, showToast, effectiveFolderId],
  )

  const handleRename = async (newName: string) => {
    if (!renameItem) return
    if (renameItem.type === 'file') {
      await renameFile.mutateAsync({ id: renameItem.id, name: newName })
      showToast('File renamed', 'success')
    } else {
      await renameFolder.mutateAsync({ id: renameItem.id, name: newName })
      showToast('Folder renamed', 'success')
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    try {
      if (deleteItem.type === 'file') {
        await deleteFileMutation.mutateAsync(deleteItem.id)
        showToast('File deleted', 'success')
      } else {
        const folder = deleteItem as DocumentFolder
        const hasChildren = (folder.childrenCount ?? 0) > 0
        if (hasChildren) {
          // Recursive delete
          const result = await deleteFolderRecursiveMutation.mutateAsync(deleteItem.id)
          showToast(`Deleted ${result.foldersDeleted} folder(s) and ${result.filesDeleted} file(s)`, 'success')
        } else {
          await deleteFolderMutation.mutateAsync(deleteItem.id)
          showToast('Folder deleted', 'success')
        }
        if (currentFolderId === deleteItem.id) {
          setCurrentFolderId(null)
        }
      }
      setDeleteOpen(false)
      setDeleteItem(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  const handleDownload = async (file: DocumentFile) => {
    try {
      await downloadFileMutation.mutateAsync({ id: file.id, name: file.name })
      showToast('Download started', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Download failed', 'error')
    }
  }

  const openRename = (item: DocumentFolder | DocumentFile) => {
    setRenameItem(item)
    setRenameOpen(true)
    setContextMenu(null)
  }

  const openDelete = (item: DocumentFolder | DocumentFile) => {
    setDeleteItem(item)
    setDeleteOpen(true)
    setContextMenu(null)
  }

  const totalSize = files.reduce((acc, f) => acc + f.size, 0)
  return (
    <Box
      sx={{ minWidth: 0, width: '100%', overflow: 'hidden', p: 1, position: 'relative' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && canUpload && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            border: '3px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'background.paper',
            }}
          >
            <CloudUploadOutlined sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Drop files to upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Release to add files to this folder
            </Typography>
          </Paper>
        </Box>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <input
        ref={folderInputRef}
        type="file"
        style={{ display: 'none' }}
        // @ts-expect-error – webkitdirectory is not in TS types yet
        webkitdirectory=""
        multiple
        onChange={handleFolderSelect}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 1,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          p: 0.5,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <TextField
          fullWidth
          placeholder="Search documents..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: { sm: '1 1 280px' },
            minWidth: 0,
            maxWidth: { xs: '100%', sm: 400 },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.50',
              borderRadius: 2,
              '&:hover': { bgcolor: 'grey.100' },
              '&.Mui-focused': { bgcolor: 'background.paper' },
            },
          }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minWidth: 0, alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'grey.100',
              borderRadius: 2,
              p: 0.25,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: 1.5,
                bgcolor: viewMode === 'list' ? 'white' : 'transparent',
                boxShadow: viewMode === 'list' ? 1 : 0,
                '&:hover': { bgcolor: viewMode === 'list' ? 'white' : 'grey.200' },
              }}
              title="List view"
            >
              <ViewListOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: 1.5,
                bgcolor: viewMode === 'grid' ? 'white' : 'transparent',
                boxShadow: viewMode === 'grid' ? 1 : 0,
                '&:hover': { bgcolor: viewMode === 'grid' ? 'white' : 'grey.200' },
              }}
              title="Grid view"
            >
              <ViewModuleOutlined fontSize="small" />
            </IconButton>
          </Box>
          {canUpload && (
            <>
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                endIcon={<ExpandMore />}
                onClick={(e) => setNewMenuAnchor(e.currentTarget)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.35)',
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                  },
                }}
              >
                New
              </Button>
              <Menu
                anchorEl={newMenuAnchor}
                open={!!newMenuAnchor}
                onClose={() => setNewMenuAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    setNewMenuAnchor(null)
                    setCreateFolderOpen(true)
                  }}
                >
                  New Folder
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setNewMenuAnchor(null)
                    handleFolderUpload()
                  }}
                >
                  Upload Folder
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setNewMenuAnchor(null)
                    handleUpload()
                  }}
                >
                  Upload Files
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                size="small"
                startIcon={<CloudUploadOutlined />}
                onClick={handleUpload}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Upload
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 1,
          flexWrap: 'wrap',
          py: 0.5,
          px: 1,
          borderRadius: 2,
          bgcolor: 'grey.50',
        }}
      >
        <IconButton
          size="small"
          onClick={() => setCurrentFolderId(null)}
          sx={{
            borderRadius: 1.5,
            '&:hover': { bgcolor: 'grey.200' },
          }}
        >
          <HomeOutlined fontSize="small" />
        </IconButton>
        {breadcrumb.map((b, i) => (
          <Box key={b.id ?? 'root'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {i > 0 && (
              <ChevronRight fontSize="small" sx={{ color: 'grey.400', fontSize: 18 }} />
            )}
            <Typography
              component="button"
              variant="body2"
              onClick={() => setCurrentFolderId(b.id)}
              sx={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: i === breadcrumb.length - 1 ? 'text.primary' : 'text.secondary',
                fontWeight: i === breadcrumb.length - 1 ? 600 : 500,
                py: 0.25,
                px: 0.75,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: i < breadcrumb.length - 1 ? 'grey.200' : 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              {b.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {projectPath && !canUpload && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Only Admin and Super Admin can upload or create folders.
        </Typography>
      )}

      {uploadProgress && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <CloudUploadOutlined color="primary" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {uploadProgress.currentFile ? `Uploading: ${uploadProgress.currentFile}` : 'Uploading...'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {uploadProgress.done !== undefined && uploadProgress.total !== undefined
                  ? `${uploadProgress.done} / ${uploadProgress.total} files`
                  : `${uploadProgress.percent}%`}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {uploadProgress.percent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={uploadProgress.percent}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Paper>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            Loading documents...
          </Typography>
        </Box>
      ) : error ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'error.light',
            bgcolor: 'rgba(211, 47, 47, 0.06)',
          }}
        >
          <Typography color="error" fontWeight={600}>
            {error instanceof Error ? error.message : 'Failed to load documents'}
          </Typography>
        </Paper>
      ) : (
        <>
          {projectPath && !rootFolder && folders.length === 0 && files.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {canUpload
                ? `Create folder ${projectPath.replace(/^\/+/, '').replace(/\//g, ' > ')} to add files here.`
                : 'No documents in this project yet.'}
            </Typography>
          )}

          {projectPath && rootFolder && folders.length === 0 && files.length === 0 && canUpload && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
              }}
            >
              <CloudUploadOutlined sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                No files in this folder
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a folder or upload files to get started
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setCreateFolderOpen(true)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  New Folder
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadOutlined />}
                  onClick={handleUpload}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Upload
                </Button>
              </Box>
            </Paper>
          )}

          {folders.length === 0 && files.length === 0 && !projectPath && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.alpha6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <CloudUploadOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                My Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload and create folders only from project Documents. Go to Services → Project → Documents tab.
              </Typography>
            </Paper>
          )}

          {(folders.length > 0 || files.length > 0) && (
            viewMode === 'grid' ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(120px, 1fr))',
                  sm: 'repeat(auto-fill, minmax(140px, 1fr))',
                  md: 'repeat(auto-fill, minmax(150px, 1fr))',
                },
                gap: { xs: 1.5, sm: 2 },
                mb: 2,
                p: 1,
                borderRadius: 1,
              }}
            >
              {folders.map((folder) => (
                <Box
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({ anchor: e.currentTarget as HTMLElement, item: folder })
                  }}
                  sx={{
                    position: 'relative',
                    py: 1.5,
                    px: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(253, 184, 19, 0.12)',
                      transform: 'scale(1.05)',
                      '& .grid-item-more': { opacity: 1 },
                      '& .grid-folder-icon': { transform: 'scale(1.08)' },
                    },
                  }}
                >
                  <Box
                    className="grid-folder-icon"
                    sx={{
                      position: 'relative',
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <FolderOutlined sx={{ fontSize: 56, color: '#FDB813' }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 6,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'white',
                        borderRadius: 0.5,
                        boxShadow: '0 0.5px 2px rgba(0,0,0,0.15)',
                      }}
                    >
                      <DescriptionOutlined sx={{ fontSize: 16, color: '#1976d2' }} />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 400,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      color: '#000',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {folder.name}
                  </Typography>
                  <IconButton
                    size="small"
                    className="grid-item-more"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      opacity: 0,
                      p: 0.25,
                      '&:hover': { bgcolor: 'grey.200' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setContextMenu({ anchor: e.currentTarget, item: folder })
                    }}
                  >
                    <MoreVert sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
              {files.map((file) => {
                const isImage = isImageFile(file.mimeType)
                return (
                  <Box
                    key={file.id}
                    onClick={() => handleDownload(file)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContextMenu({ anchor: e.currentTarget as HTMLElement, item: file })
                    }}
                    sx={{
                      position: 'relative',
                      py: isImage ? 0 : 1.5,
                      px: isImage ? 0 : 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderRadius: isImage ? 2 : 1,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      border: isImage ? '1px solid' : 'none',
                      borderColor: 'grey.200',
                      '&:hover': {
                        bgcolor: isImage ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                        transform: 'scale(1.04)',
                        boxShadow: isImage ? '0 4px 16px rgba(0,0,0,0.14)' : 'none',
                        '& .grid-item-more': { opacity: 1 },
                        '& .grid-file-icon': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                          borderColor: 'primary.light',
                        },
                        '& .img-overlay': { opacity: 1 },
                      },
                    }}
                  >
                    {isImage ? (
                      /* Image thumbnail – fills grid cell */
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        <Box
                          sx={{
                            width: '100%',
                            paddingTop: '75%',  // 4:3 aspect ratio
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '8px 8px 0 0',
                          }}
                        >
                          <Box sx={{ position: 'absolute', inset: 0 }}>
                            <ImageThumbnail fileId={file.id} alt={file.name} />
                          </Box>
                          {/* Hover overlay */}
                          <Box
                            className="img-overlay"
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              bgcolor: 'rgba(0,0,0,0.28)',
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: 'white', fontWeight: 600 }}
                            >
                              Download
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            bgcolor: 'background.paper',
                          }}
                        >
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{
                              display: 'block',
                              color: 'text.primary',
                              fontWeight: 500,
                              fontSize: '0.72rem',
                            }}
                          >
                            {file.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', fontSize: '0.65rem' }}
                          >
                            {formatSize(file.size)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      /* Non-image file – icon */
                      <>
                        <Box
                          className="grid-file-icon"
                          sx={{
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            bgcolor: '#fff',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 0.5,
                            transition: 'all 0.2s ease',
                            '& svg': { fontSize: 36 },
                          }}
                        >
                          {getFileIcon(file.mimeType)}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 400,
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                            color: '#000',
                            fontSize: '0.8125rem',
                          }}
                        >
                          {file.name}
                        </Typography>
                      </>
                    )}
                    <IconButton
                      size="small"
                      className="grid-item-more"
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        opacity: 0,
                        p: 0.25,
                        bgcolor: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: 'white' },
                        zIndex: 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setContextMenu({ anchor: e.currentTarget, item: file })
                      }}
                    >
                      <MoreVert sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                )
              })}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <List disablePadding>
                {folders.map((folder) => (
                  <ListItem
                    key={folder.id}
                    divider
                    onClick={() => setCurrentFolderId(folder.id)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContextMenu({ anchor: e.currentTarget as HTMLElement, item: folder })
                    }}
                    sx={{
                      cursor: 'pointer',
                      py: 1.5,
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background 0.2s ease',
                    }}
                    secondaryAction={
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          setContextMenu({ anchor: e.currentTarget, item: folder })
                        }}
                        sx={{ borderRadius: 1 }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FolderOutlined sx={{ color: 'white', fontSize: 22 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={folder.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                          {(folder.childrenCount ?? 0) > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {folder.childrenCount} items
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatDateDisplay(folder.updatedAt ?? folder.createdAt)}
                          </Typography>
                        </Box>
                      }
                      slotProps={{ primary: { fontWeight: 600, noWrap: true } }}
                    />
                  </ListItem>
                ))}
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    divider
                    onClick={() => handleDownload(file)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContextMenu({ anchor: e.currentTarget as HTMLElement, item: file })
                    }}
                    sx={{
                      cursor: 'pointer',
                      py: 1.5,
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background 0.2s ease',
                    }}
                    secondaryAction={
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          setContextMenu({ anchor: e.currentTarget, item: file })
                        }}
                        sx={{ borderRadius: 1 }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: 'grey.100',
                          border: '1px solid',
                          borderColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& svg': { fontSize: 20 },
                        }}
                      >
                        {getFileIcon(file.mimeType)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatSize(file.size)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateDisplay(file.uploadedAt ?? file.updatedAt)}
                          </Typography>
                        </Box>
                      }
                      slotProps={{ primary: { fontWeight: 600, noWrap: true } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )
          )}

          <Menu
              anchorEl={contextMenu?.anchor}
              open={!!contextMenu}
              onClose={() => setContextMenu(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {contextMenu?.item.type === 'file' && (
                <MenuItem
                  onClick={() => {
                    handleDownload(contextMenu.item as DocumentFile)
                    setContextMenu(null)
                  }}
                >
                  Download
                </MenuItem>
              )}
              <MenuItem onClick={() => openRename(contextMenu!.item)}>Rename</MenuItem>
              <MenuItem
                onClick={() => openDelete(contextMenu!.item)}
                sx={{ color: 'error.main' }}
              >
                Delete
              </MenuItem>
            </Menu>

          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              py: 1,
              px: 1.5,
              borderRadius: 2,
              bgcolor: 'grey.50',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'grey.200',
              zIndex: 10,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {folders.length} folder{folders.length !== 1 ? 's' : ''} · {files.length} file
              {files.length !== 1 ? 's' : ''} · {formatSize(totalSize)}
            </Typography>
          </Box>
        </>
      )}

      <CreateFolderDialog
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
        loading={createFolderMutation.isPending}
      />

      <RenameDialog
        open={renameOpen}
        name={renameItem?.name ?? ''}
        onClose={() => {
          setRenameOpen(false)
          setRenameItem(null)
        }}
        onSubmit={handleRename}
        loading={renameFile.isPending || renameFolder.isPending}
      />

      <ConfirmationModal
        open={deleteOpen}
        title="Delete"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.name}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false)
          setDeleteItem(null)
        }}
        loading={deleteFileMutation.isPending || deleteFolderMutation.isPending}
      />
    </Box>
  )
}
