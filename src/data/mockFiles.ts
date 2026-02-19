export interface FileItem {
  id: string
  name: string
  size: string
  modified: string
  type: 'pdf' | 'dwg' | 'pptx' | 'xlsx' | 'zip' | 'folder'
}

export interface FolderItem {
  id: string
  name: string
  fileCount: number
}

export const mockFolders: FolderItem[] = [
  { id: '1', name: 'Civil', fileCount: 3 },
  { id: '2', name: 'Electrical', fileCount: 3 },
  { id: '3', name: 'Mechanical', fileCount: 8 },
]

export const mockFiles: FileItem[] = [
  { id: '1', name: 'Awan Project Report.pdf', size: '1.2 MB', modified: '5 minutes ago', type: 'pdf' },
  { id: '2', name: 'Kayampur Drawing.dwg', size: '9.8 MB', modified: '1 hour ago', type: 'dwg' },
  { id: '3', name: 'Presentation Q4.pptx', size: '4.1 MB', modified: 'Yesterday', type: 'pptx' },
  { id: '4', name: 'Budget Summary.xlsx', size: '0.8 MB', modified: 'Monday', type: 'xlsx' },
  { id: '5', name: 'Backup Archive.zip', size: '11.5 MB', modified: 'Last Friday', type: 'zip' },
]

export const breadcrumbPath = ['Home', 'Irrigation', 'Madhya Pradesh', 'Kayampur', 'Automation']
