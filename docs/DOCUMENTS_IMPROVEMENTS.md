# Documents Feature – Improvement Plan

> Backend aur Frontend dono ke liye suggestions. Priority order me list kiya gaya hai.

---

## Backend Improvements

### 1. **Indexes (Performance)**
```javascript
// Folder schema
FolderSchema.index({ parentId: 1, name: 1 });
FolderSchema.index({ path: 1 }, { unique: true });
FolderSchema.index({ path: 1 });  // for findByPath

// File schema
FileMetadataSchema.index({ folderId: 1, updatedAt: -1 });
FileMetadataSchema.index({ name: 'text' });  // for search
```
**Benefit:** Fast queries, especially with large data.

---

### 2. **Search – Service/Path Scoped**
Abhi search globally karta hai. Project view me search karte waqt sirf us path ke andar search hona chahiye.

```typescript
// documents.controller.ts - search me pathPrefix add karo
@Get('search')
async search(@Query('q') q?: string, @Query('pathPrefix') pathPrefix?: string) {
  // pathPrefix = /irrigation/kayampur-sitamau
  // Sirf folders/files jinke path/parentPath iske andar ho
}
```

**FilesService:** File ke folder ko resolve karke path check karo.
**FoldersService:** `findByPathPrefix(pathPrefix)` – path.startsWith(pathPrefix)

---

### 3. **Folder Delete – Cascade Option**
Abhi folder delete tabhi hota hai jab andar koi subfolder na ho. Option: cascade delete (sab children + files delete) ya soft delete.

```typescript
// FoldersService - recursive delete
async delete(id: string, cascade = false): Promise<void> {
  if (cascade) {
    // Delete all files in folder + subfolders
    // Delete all subfolders recursively
  } else {
    // Current logic - reject if has children
  }
}
```

---

### 4. **File Size & Type Validation**
```typescript
// files.controller.ts - upload
- Max file size: config se (50MB default)
- Allowed MIME types: whitelist (pdf, images, doc, xlsx, etc.)
- Virus scan (optional – ClamAV)
```

---

### 5. **Pagination**
Large folders ke liye:

```typescript
GET /documents?folderId=xxx&page=1&limit=50
Response: { folders, files, total, hasMore }
```

---

### 6. **Sort & Filter (Query Params)**
```typescript
GET /documents?folderId=xxx&sortBy=name|date|size&sortOrder=asc|desc
GET /documents?folderId=xxx&type=file|folder
```

---

### 7. **Bulk Operations**
```typescript
POST /documents/bulk-delete  { ids: string[] }
POST /documents/bulk-move    { ids: string[], targetFolderId: string }
```

---

### 8. **Audit / Activity Log**
- Kon kab upload/delete/rename kiya
- `uploadedBy`, `updatedBy` already hai – extend for full audit trail

---

### 9. **Duplicate Name Handling**
Rename/create me extension preserve karo (file rename). Folder me same parent + same name = error (already hai).

---

### 10. **Storage – Cloud (S3/MinIO)**
Abhi local disk. Scale ke liye S3/MinIO use karo – `storagePath` = bucket key.

---

## Frontend Improvements

### 1. **Search – Actually Use It**
Abhi `searchQuery` state hai par API call nahi ho rahi. Debounced search implement karo:

```typescript
// useDocumentsSearch with debounce 300ms
// When searchQuery.length > 0, show search results instead of folder list
```

---

### 2. **Grid View Toggle**
Spec me List + Grid view hai. Abhi sirf list. Add:
- ViewMode state: 'list' | 'grid'
- Grid: cards with icon, name, size
- Sort dropdown (name, date, size)

---

### 3. **Drag & Drop Upload**
```tsx
<Box
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
  sx={{ border: '2px dashed', borderColor: 'divider', p: 4, borderRadius: 2 }}
>
  Drop files here
</Box>
```

---

### 4. **Upload Progress**
Multiple files upload me progress bar / per-file status.

```typescript
// useUploadFile - track progress via axios onUploadProgress
// Show: "Uploading 2/5..."
```

---

### 5. **Loading Skeletons**
Abhi CircularProgress. Skeleton rows/cards better UX.

---

### 6. **Empty States**
- No folders/files: "Upload your first file" + CTA
- No search results: "No documents found"
- Project folder not created: Already hai – improve copy

---

### 7. **Move Dialog**
Context menu me "Move to" – folder tree picker modal. User select kare destination folder.

---

### 8. **Multi-Select + Bulk Actions**
- Checkbox on each item
- Toolbar: "Select all", "Delete selected", "Move selected"
- Shift+click for range select

---

### 9. **Keyboard Shortcuts**
- Delete: selected item delete
- F2: rename
- Ctrl+A: select all
- Escape: clear selection

---

### 10. **File Preview**
- Images: lightbox/modal
- PDF: embed or new tab
- Optional: office docs preview (docx, xlsx) – third-party lib

---

### 11. **Breadcrumb – Project View Fix**
Project view me "Home" click = project root, not global root. Breadcrumb me service > project > subfolder chain clearly dikhao.

---

### 12. **Optimistic Updates**
Create/rename/delete me UI turant update, API fail hone par rollback + toast.

---

### 13. **Error Boundaries**
FileExplorer ko ErrorBoundary me wrap karo – crash hone par fallback UI.

---

### 14. **Virtualization**
1000+ files me list slow. react-window ya MUI DataGrid virtualize karke render karo.

---

### 15. **URL Sync**
```
/documents
/documents?folder=xxx
/documents?path=/irrigation/kayampur-sitamau
```
Browser back/forward, share link support.

---

## Priority Order (Suggested)

| Priority | Item                    | Effort | Impact |
|----------|-------------------------|--------|--------|
| P0       | Search actually work    | Low    | High   |
| P0       | Backend indexes         | Low    | High   |
| P1       | Grid view               | Medium | Medium |
| P1       | Drag-drop upload        | Low    | High   |
| P1       | Upload progress         | Medium | Medium |
| P1       | Search scoped by path   | Medium | High   |
| P2       | Move dialog             | Medium | High   |
| P2       | Multi-select + bulk     | Medium | High   |
| P2       | Loading skeletons       | Low    | Medium |
| P2       | Empty states            | Low    | Medium |
| P3       | Pagination              | Medium | Medium |
| P3       | File preview            | High   | Medium |
| P3       | URL sync                | Medium | Medium |

---

## Quick Wins (1–2 hours each)

1. **Search:** `searchQuery` ko `useDocumentsSearch` se connect karo, debounce 300ms
2. **Indexes:** Folder + File schema me indexes add karo
3. **Empty state:** Better copy + upload CTA
4. **Grid view:** Simple toggle, cards layout

---

*Document created for Vensar Drive – Documents Feature Improvements*
