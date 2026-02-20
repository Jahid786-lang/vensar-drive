# Documents Feature – OneDrive Style Specification

> **Purpose:** This document defines the complete logic, data models, API design, and implementation plan for the DocumentsPage. Finalize this document first, then implement the UI.

---

## 1. Overview

The Documents feature will be like OneDrive/Google Drive – hierarchical folders, file upload/download, search, preview, and basic file operations.

### Core Capabilities
- **Folder hierarchy** – nested folders (already partially exists)
- **File CRUD** – upload, download, rename, delete, move
- **Navigation** – breadcrumb, folder click, back
- **Search** – files/folders by name
- **View modes** – List view, Grid view
- **Sort & filter** – name, date, size, type
- **Context menu** – right-click / three-dot actions
- **Selection** – multi-select for bulk actions
- **File preview** – images, PDF (optional phase 2)

---

## 2. Data Models

### 2.1 FileItem (Backend Response)

```typescript
interface FileItem {
  id: string
  name: string
  mimeType: string          // e.g. "application/pdf", "image/png"
  size: number              // bytes
  folderId: string | null   // null = root
  uploadedAt: string        // ISO date
  updatedAt: string
  uploadedBy?: string       // userId
  storagePath?: string      // backend storage path (internal use)
}
```

### 2.2 FolderItem (Backend Response)

```typescript
interface FolderItem {
  id: string
  name: string
  parentId: string | null   // null = root
  path: string             // e.g. "/irrigation/projects/kayampur"
  createdAt: string
  updatedAt: string
  createdBy?: string
  order?: number
}
```

### 2.3 Unified Item (for the UI)

```typescript
type ItemType = 'file' | 'folder'

interface DocumentItem {
  id: string
  name: string
  type: ItemType
  // File-specific
  size?: number
  mimeType?: string
  uploadedAt?: string
  // Folder-specific
  parentId?: string | null
  path?: string
  childrenCount?: number
}
```

### 2.4 Breadcrumb

```typescript
interface BreadcrumbItem {
  id: string | null   // null = root
  name: string
  path: string
}
```

---

## 3. API Endpoints

### 3.1 Folders (existing + extend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/folders` | Flat list of all folders |
| GET | `/folders/:id` | Single folder details |
| POST | `/folders` | Create folder `{ parentId, name }` |
| PATCH | `/folders/:id` | Rename `{ name }` or Move `{ parentId }` |
| DELETE | `/folders/:id` | Delete folder (cascade or reject if has children) |

### 3.2 Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List files (query: `?folderId=xxx` or root) |
| GET | `/files/:id` | File metadata |
| GET | `/files/:id/download` | Download file (stream) |
| POST | `/files/upload` | Multipart upload `(file, folderId?)` |
| PATCH | `/files/:id` | Rename `{ name }` or Move `{ folderId }` |
| DELETE | `/files/:id` | Delete file |

### 3.3 Combined Listing (Optional – backend decision)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | List folders + files in one call `?folderId=xxx` |

If the backend provides separate endpoints, the frontend will combine both.

### 3.4 Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/search?q=query` | Search files + folders by name |

---

## 4. Business Logic

### 4.1 Current Folder Path (Navigation State)

```
currentFolderId: string | null
- null = root (My Files)
- "xyz" = specific folder
```

### 4.2 Loading Data

1. **On mount / folder change:**
   - `fetchFolders()` → flat list
   - `fetchFiles(folderId)` → files in current folder
   - `buildFolderTree(flat)` → for the sidebar tree

2. **Child folders:**
   - Direct children of the current folder = `flat.filter(f => f.parentId === currentFolderId)`

3. **Breadcrumb:**
   - Trace path from `currentFolderId`: `path.split('/')` or get path array from backend

### 4.3 Create Folder

```
Input: name, parentId (currentFolderId or null)
1. Validate: name non-empty, unique in same parent
2. POST /folders { parentId, name }
3. Invalidate folders query → refetch
4. Optional: navigate to the new folder
```

### 4.4 Upload File

```
Input: File(s), folderId (currentFolderId or null)
1. Validate: file size limit, allowed types
2. FormData: append file, folderId
3. POST /files/upload (multipart)
4. Invalidate files query → refetch
```

### 4.5 Rename

```
Input: item (file/folder), newName
1. Validate: newName non-empty, unique in same parent
2. PATCH /files/:id { name } or PATCH /folders/:id { name }
3. Invalidate queries
```

### 4.6 Move

```
Input: item, targetFolderId
1. Validate: target != same folder, no circular ref (folder move)
2. PATCH /files/:id { folderId } or PATCH /folders/:id { parentId }
3. Invalidate queries
```

### 4.7 Delete

```
Input: item (file/folder)
1. Confirm modal
2. DELETE /files/:id or DELETE /folders/:id
3. Backend: folder delete = cascade or reject
4. Invalidate queries
```

### 4.8 Download

```
GET /files/:id/download
- Response: blob/stream
- Frontend: create object URL, trigger download with original filename
```

### 4.9 Search

```
Input: query string
1. Debounce 300ms
2. GET /documents/search?q=query
3. Show results (files + folders) with path/breadcrumb
```

### 4.10 Sort & Filter

- **Sort:** name (A–Z, Z–A), date (newest, oldest), size (largest, smallest)
- **Filter:** type (folder, pdf, image, etc.)
- Frontend-only: fetch full list from API, client-side sort/filter (or use query params if backend supports it)

---

## 5. UI Structure

### 5.1 Layout

```
+--------------------------------------------------+
| [Search...]        [New ▼] [Upload] [View] [Sort]|
+--------------------------------------------------+
| Home > Irrigation > Projects > Kayampur          |
+--------------------------------------------------+
| +------------------+  +------------------+       |
| | [Folder] Civil   |  | [Folder] Mech    |  ...  |
| | 3 items          |  | 8 items          |       |
| +------------------+  +------------------+       |
|                                                  |
| [Icon] Report.pdf      1.2 MB   5 min ago   ⋮   |
| [Icon] Drawing.dwg    9.8 MB   1 hour ago  ⋮   |
| ...                                              |
+--------------------------------------------------+
| 5 files · 27.4 MB                                |
+--------------------------------------------------+
```

### 5.2 Components (Proposed)

| Component | Responsibility |
|-----------|----------------|
| `DocumentsPage` | Layout wrapper, route |
| `FileExplorer` | Main container, state (currentFolderId, selection, sort) |
| `DocumentsToolbar` | Search, New, Upload, View toggle, Sort |
| `BreadcrumbNav` | Home > ... > Current |
| `FolderGrid` | Grid view of folders |
| `FileList` / `FileGrid` | List/Grid view of files |
| `DocumentItem` | Single row/card (file or folder) |
| `ContextMenu` | Right-click / ⋮ menu |
| `CreateFolderDialog` | New folder modal |
| `RenameDialog` | Rename modal |
| `MoveDialog` | Move to folder (tree picker) |
| `DeleteConfirmModal` | Delete confirmation |
| `UploadZone` | Drag-drop + click to upload |

### 5.3 View Modes

- **List:** Rows with icon, name, size, date, actions
- **Grid:** Cards with icon, name, optional size/date

### 5.4 Selection & Bulk Actions

- Checkbox on each item
- "Select all" in toolbar
- Bulk: Delete, Move, Download (files only)

---

## 6. State Management

### 6.1 React Query Keys

```typescript
['folders', 'tree']
['folders', 'flat']
['files', folderId]
['documents', 'search', query]
```

### 6.2 Local State (FileExplorer)

```typescript
currentFolderId: string | null
viewMode: 'list' | 'grid'
sortBy: 'name' | 'date' | 'size'
sortOrder: 'asc' | 'desc'
selectedIds: Set<string>
searchQuery: string
contextMenu: { anchor, item } | null
dialog: 'createFolder' | 'rename' | 'move' | 'delete' | null
```

### 6.3 URL Sync (Optional)

```
/documents
/documents?folder=xyz
/documents?folder=xyz&view=grid
```

---

## 7. Implementation Phases

### Phase 1 – Core (MVP)
1. Data models & types
2. API functions (files + folders)
3. Current folder navigation + breadcrumb
4. List folders & files in current folder
5. Create folder
6. Upload file
7. Rename, Delete (single item)
8. Download file
9. Context menu (Open, Download, Rename, Delete)

### Phase 2 – UX
1. Grid view
2. Sort (name, date, size)
3. Search
4. Move dialog
5. Multi-select + bulk delete/move

### Phase 3 – Polish
1. File preview (images, PDF)
2. Drag-drop upload
3. Keyboard shortcuts
4. Loading skeletons
5. Empty states

---

## 8. File Type Icons Mapping

```typescript
const FILE_ICONS: Record<string, React.ReactNode> = {
  'application/pdf': <PictureAsPdfOutlined />,
  'image/png': <ImageOutlined />,
  'image/jpeg': <ImageOutlined />,
  'application/vnd.ms-excel': <TableChartOutlined />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <TableChartOutlined />,
  'application/vnd.ms-powerpoint': <SlideshowOutlined />,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': <SlideshowOutlined />,
  'application/zip': <FolderOutlined />,
  // default
  default: <InsertDriveFileOutlined />,
}
```

---

## 9. Validation Rules

- **Folder name:** 1–255 chars, no `/\:*?"<>|`
- **File name:** Same + preserve extension on rename
- **Upload:** Max size (e.g. 50MB), allowed MIME types
- **Move:** No circular reference (folder → descendant)

---

## 10. Error Handling

- Network errors → Toast
- 403/401 → Redirect to login
- 404 → "Not found" message
- Validation errors → Inline under field

---

## 11. Mock Data (Development)

When backend is not available:
- `getMockFlatFolders()` – already exists
- `getMockFiles(folderId)` – add in mockFiles.ts
- Mock upload: generate ID, add to list, no real storage

---

## Next Steps

1. **Review** – Any additions or changes needed in this spec?
2. **Backend** – If the backend uses a different structure, adapt accordingly
3. **Phase 1** – Implement types, API, and basic UI
4. **Phase 2 & 3** – Iterate

---

*Document created for Vensar Drive – Documents Feature*


# Documents Feature – OneDrive Style Specification

> **Purpose:** Yeh document DocumentsPage ke liye complete logic, data models, API design aur implementation plan define karta hai. Pehle yeh document final karo, phir UI aur implementation karenge.

---

## 1. Overview

Documents feature OneDrive/Google Drive jaisa hoga – hierarchical folders, file upload/download, search, preview, aur basic file operations.

### Core Capabilities
- **Folder hierarchy** – nested folders (already partially exists)
- **File CRUD** – upload, download, rename, delete, move
- **Navigation** – breadcrumb, folder click, back
- **Search** – files/folders by name
- **View modes** – List view, Grid view
- **Sort & filter** – name, date, size, type
- **Context menu** – right-click / three-dot actions
- **Selection** – multi-select for bulk actions
- **File preview** – images, PDF (optional phase 2)

---

## 2. Data Models

### 2.1 FileItem (Backend Response)

```typescript
interface FileItem {
  id: string
  name: string
  mimeType: string          // e.g. "application/pdf", "image/png"
  size: number              // bytes
  folderId: string | null   // null = root
  uploadedAt: string        // ISO date
  updatedAt: string
  uploadedBy?: string       // userId
  storagePath?: string      // backend storage path (internal use)
}
```

### 2.2 FolderItem (Backend Response)

```typescript
interface FolderItem {
  id: string
  name: string
  parentId: string | null   // null = root
  path: string             // e.g. "/irrigation/projects/kayampur"
  createdAt: string
  updatedAt: string
  createdBy?: string
  order?: number
}
```

### 2.3 Unified Item (UI ke liye)

```typescript
type ItemType = 'file' | 'folder'

interface DocumentItem {
  id: string
  name: string
  type: ItemType
  // File-specific
  size?: number
  mimeType?: string
  uploadedAt?: string
  // Folder-specific
  parentId?: string | null
  path?: string
  childrenCount?: number
}
```

### 2.4 Breadcrumb

```typescript
interface BreadcrumbItem {
  id: string | null   // null = root
  name: string
  path: string
}
```

---

## 3. API Endpoints

### 3.1 Folders (existing + extend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/folders` | Flat list of all folders |
| GET | `/folders/:id` | Single folder details |
| POST | `/folders` | Create folder `{ parentId, name }` |
| PATCH | `/folders/:id` | Rename `{ name }` or Move `{ parentId }` |
| DELETE | `/folders/:id` | Delete folder (cascade or reject if has children) |

### 3.2 Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List files (query: `?folderId=xxx` or root) |
| GET | `/files/:id` | File metadata |
| GET | `/files/:id/download` | Download file (stream) |
| POST | `/files/upload` | Multipart upload `(file, folderId?)` |
| PATCH | `/files/:id` | Rename `{ name }` or Move `{ folderId }` |
| DELETE | `/files/:id` | Delete file |

### 3.3 Combined Listing (Optional – backend decision)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | List folders + files in one call `?folderId=xxx` |

Agar backend alag endpoints deta hai toh frontend dono ko combine karega.

### 3.4 Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/search?q=query` | Search files + folders by name |

---

## 4. Business Logic

### 4.1 Current Folder Path (Navigation State)

```
currentFolderId: string | null
- null = root (My Files)
- "xyz" = specific folder
```

### 4.2 Loading Data

1. **On mount / folder change:**
   - `fetchFolders()` → flat list
   - `fetchFiles(folderId)` → files in current folder
   - `buildFolderTree(flat)` → sidebar tree ke liye

2. **Child folders:**
   - Current folder ke direct children = `flat.filter(f => f.parentId === currentFolderId)`

3. **Breadcrumb:**
   - `currentFolderId` se path trace karo: `path.split('/')` ya backend se path array

### 4.3 Create Folder

```
Input: name, parentId (currentFolderId ya null)
1. Validate: name non-empty, unique in same parent
2. POST /folders { parentId, name }
3. Invalidate folders query → refetch
4. Optional: new folder pe navigate
```

### 4.4 Upload File

```
Input: File(s), folderId (currentFolderId ya null)
1. Validate: file size limit, allowed types
2. FormData: append file, folderId
3. POST /files/upload (multipart)
4. Invalidate files query → refetch
```

### 4.5 Rename

```
Input: item (file/folder), newName
1. Validate: newName non-empty, unique in same parent
2. PATCH /files/:id { name } ya PATCH /folders/:id { name }
3. Invalidate queries
```

### 4.6 Move

```
Input: item, targetFolderId
1. Validate: target != same folder, no circular ref (folder move)
2. PATCH /files/:id { folderId } ya PATCH /folders/:id { parentId }
3. Invalidate queries
```

### 4.7 Delete

```
Input: item (file/folder)
1. Confirm modal
2. DELETE /files/:id ya DELETE /folders/:id
3. Backend: folder delete = cascade ya reject
4. Invalidate queries
```

### 4.8 Download

```
GET /files/:id/download
- Response: blob/stream
- Frontend: create object URL, trigger download with original filename
```

### 4.9 Search

```
Input: query string
1. Debounce 300ms
2. GET /documents/search?q=query
3. Show results (files + folders) with path/breadcrumb
```

### 4.10 Sort & Filter

- **Sort:** name (A–Z, Z–A), date (newest, oldest), size (largest, smallest)
- **Filter:** type (folder, pdf, image, etc.)
- Frontend-only: API se full list lao, client-side sort/filter (ya backend support kare toh query params)

---

## 5. UI Structure

### 5.1 Layout

```
+--------------------------------------------------+
| [Search...]        [New ▼] [Upload] [View] [Sort]|
+--------------------------------------------------+
| Home > Irrigation > Projects > Kayampur          |
+--------------------------------------------------+
| +------------------+  +------------------+       |
| | [Folder] Civil   |  | [Folder] Mech    |  ...  |
| | 3 items          |  | 8 items          |       |
| +------------------+  +------------------+       |
|                                                  |
| [Icon] Report.pdf      1.2 MB   5 min ago   ⋮   |
| [Icon] Drawing.dwg    9.8 MB   1 hour ago  ⋮   |
| ...                                              |
+--------------------------------------------------+
| 5 files · 27.4 MB                                |
+--------------------------------------------------+
```

### 5.2 Components (Proposed)

| Component | Responsibility |
|-----------|----------------|
| `DocumentsPage` | Layout wrapper, route |
| `FileExplorer` | Main container, state (currentFolderId, selection, sort) |
| `DocumentsToolbar` | Search, New, Upload, View toggle, Sort |
| `BreadcrumbNav` | Home > ... > Current |
| `FolderGrid` | Grid view of folders |
| `FileList` / `FileGrid` | List/Grid view of files |
| `DocumentItem` | Single row/card (file or folder) |
| `ContextMenu` | Right-click / ⋮ menu |
| `CreateFolderDialog` | New folder modal |
| `RenameDialog` | Rename modal |
| `MoveDialog` | Move to folder (tree picker) |
| `DeleteConfirmModal` | Delete confirmation |
| `UploadZone` | Drag-drop + click to upload |

### 5.3 View Modes

- **List:** Rows with icon, name, size, date, actions
- **Grid:** Cards with icon, name, optional size/date

### 5.4 Selection & Bulk Actions

- Checkbox on each item
- "Select all" in toolbar
- Bulk: Delete, Move, Download (files only)

---

## 6. State Management

### 6.1 React Query Keys

```typescript
['folders', 'tree']
['folders', 'flat']
['files', folderId]
['documents', 'search', query]
```

### 6.2 Local State (FileExplorer)

```typescript
currentFolderId: string | null
viewMode: 'list' | 'grid'
sortBy: 'name' | 'date' | 'size'
sortOrder: 'asc' | 'desc'
selectedIds: Set<string>
searchQuery: string
contextMenu: { anchor, item } | null
dialog: 'createFolder' | 'rename' | 'move' | 'delete' | null
```

### 6.3 URL Sync (Optional)

```
/documents
/documents?folder=xyz
/documents?folder=xyz&view=grid
```

---

## 7. Implementation Phases

### Phase 1 – Core (MVP)
1. Data models & types
2. API functions (files + folders)
3. Current folder navigation + breadcrumb
4. List folders & files in current folder
5. Create folder
6. Upload file
7. Rename, Delete (single item)
8. Download file
9. Context menu (Open, Download, Rename, Delete)

### Phase 2 – UX
1. Grid view
2. Sort (name, date, size)
3. Search
4. Move dialog
5. Multi-select + bulk delete/move

### Phase 3 – Polish
1. File preview (images, PDF)
2. Drag-drop upload
3. Keyboard shortcuts
4. Loading skeletons
5. Empty states

---

## 8. File Type Icons Mapping

```typescript
const FILE_ICONS: Record<string, React.ReactNode> = {
  'application/pdf': <PictureAsPdfOutlined />,
  'image/png': <ImageOutlined />,
  'image/jpeg': <ImageOutlined />,
  'application/vnd.ms-excel': <TableChartOutlined />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <TableChartOutlined />,
  'application/vnd.ms-powerpoint': <SlideshowOutlined />,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': <SlideshowOutlined />,
  'application/zip': <FolderOutlined />,
  // default
  default: <InsertDriveFileOutlined />,
}
```

---

## 9. Validation Rules

- **Folder name:** 1–255 chars, no `/\:*?"<>|`
- **File name:** Same + extension preserve on rename
- **Upload:** Max size (e.g. 50MB), allowed MIME types
- **Move:** No circular reference (folder → descendant)

---

## 10. Error Handling

- Network errors → Toast
- 403/401 → Redirect to login
- 404 → "Not found" message
- Validation errors → Inline under field

---

## 11. Mock Data (Development)

Backend na ho toh:
- `getMockFlatFolders()` – already exists
- `getMockFiles(folderId)` – add in mockFiles.ts
- Mock upload: generate ID, add to list, no real storage

---

## Next Steps

1. **Review** – Is spec me kuch add/change karna hai?
2. **Backend** – Agar backend alag structure use karta hai, adapt karo
3. **Phase 1** – Types, API, basic UI implement karo
4. **Phase 2 & 3** – Iterate

---

*Document created for Vensar Drive – Documents Feature*
