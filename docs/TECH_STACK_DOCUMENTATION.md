# Vensar Drive – Complete Technology Stack Documentation

> **Project:** Vensar Drive – Internal Document & Project Management System  
> **Type:** Full-Stack Web Application  
> **Architecture:** SPA (Single Page Application) + REST API Backend  
> **Last Updated:** February 2026

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend Technology Stack](#3-frontend-technology-stack)
4. [Backend Technology Stack](#4-backend-technology-stack)
5. [Database](#5-database)
6. [Authentication & Security](#6-authentication--security)
7. [File Storage](#7-file-storage)
8. [Module Structure](#8-module-structure)
9. [API Endpoints](#9-api-endpoints)
10. [UI Screens](#10-ui-screens)
11. [Role-Based Access Control](#11-role-based-access-control)
12. [Data Flow Diagram](#12-data-flow-diagram)

---

## 1. Project Overview

Vensar Drive ek internal platform hai jisme:

| Feature | Description |
|---------|-------------|
| **Services** | Irrigation, Hydro Power, Railways etc. services list |
| **Projects** | Har service ke under projects (e.g. Kayampur Sitamau) |
| **Documents** | OneDrive jaise nested folder + file management |
| **Users** | Role-based user management (Super Admin / Admin / User) |
| **Auth** | OTP-based secure login & registration |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              FRONTEND (React + Vite)                    │   │
│  │              http://localhost:5173                      │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │  Pages   │  │  Hooks   │  │  Redux   │             │   │
│  │  │ Services │  │useQuery  │  │  Store   │             │   │
│  │  │ Projects │  │useMutation│ │ (Auth)  │             │   │
│  │  │ Documents│  │          │  │          │             │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │ HTTP / REST (Axios)                  │
│  ┌───────────────────────▼─────────────────────────────────┐   │
│  │              BACKEND (NestJS + Express)                  │   │
│  │              http://localhost:3000                       │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │   Auth   │  │ Services │  │ Projects │              │   │
│  │  │ JWT+OTP  │  │ CRUD API │  │ CRUD API │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ Folders  │  │  Files   │  │  Users   │              │   │
│  │  │ CRUD API │  │Upload API│  │ CRUD API │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │ Mongoose ODM                         │
│  ┌───────────────────────▼──────────────────┐                  │
│  │           MongoDB Database                │                  │
│  │  Collections: users, services, projects, │                  │
│  │  folders, filemetadatas                   │                  │
│  └──────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Technology Stack

### Core Framework

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **React** | 19.2.0 | Component-based UI library. Fastest rerender with concurrent mode. Industry standard. |
| **TypeScript** | 5.9.3 | Type safety se bugs compile time par pakde jaate hain. Large codebase mein essential. |
| **Vite** | 7.3.1 | Ultra-fast dev server (HMR < 50ms). Production build bhi fast hai webpack se. |

### UI & Styling

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **MUI (Material UI)** | 7.3.7 | Professional UI components ready-made milte hain. Theming, icons, responsive sab built-in. |
| **@mui/icons-material** | 7.3.7 | 2000+ Google Material icons SVG format mein. Import sirf jo chahiye. |
| **@emotion/react** | 11.14.0 | MUI ka CSS-in-JS engine. Runtime mein CSS generate hoti hai, scoped rahti hai. |
| **Framer Motion** | 12.34.0 | Smooth animations ke liye. Sidebar path tree, card animations, page transitions. |
| **Tailwind CSS** | 4.1.18 | Utility classes ke liye (kuch jagah). MUI ke saath mix use. |

### State Management

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **TanStack Query (React Query)** | 5.90.21 | Server state ka best solution. Caching, background refetch, loading/error states automatic. |
| **Redux Toolkit** | 2.11.2 | Auth state (user, token) global rakhne ke liye. Sirf auth mein use, baaki sab React Query. |
| **React Redux** | 9.2.0 | Redux ko React components se connect karta hai. |

**Kyun dono (Redux + React Query)?**
- **Redux** → Auth state jo poori app mein chahiye (user info, login status)
- **React Query** → Server data (services, projects, documents) jo cache hona chahiye

### Routing

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **React Router DOM** | 7.13.0 | Client-side routing. Nested routes, protected routes, lazy loading support. |

### Forms & Validation

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **React Hook Form** | 7.71.1 | Performance-focused form library. Uncontrolled components, less re-renders. |
| **Zod** | 4.3.6 | Schema-based validation. TypeScript se automatically types milte hain. |
| **@hookform/resolvers** | 5.2.2 | RHF ko Zod se connect karta hai. |

### HTTP Client

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **Axios** | 1.13.5 | HTTP requests ke liye. Interceptors se JWT token auto-attach hota hai. Request/response transform easy. |

### Security

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **crypto-js** | 4.2.0 | JWT token ko sessionStorage mein encrypted store karte hain. Devtools se directly readable nahi hoga. |

---

## 4. Backend Technology Stack

### Core Framework

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **NestJS** | 10.x | Enterprise-grade Node.js framework. Decorators, modules, DI (Dependency Injection) built-in. Angular-inspired architecture. |
| **Express (via NestJS)** | Bundled | NestJS ke under HTTP server. Battle-tested, vast ecosystem. |
| **TypeScript** | 5.1.3 | Backend bhi type-safe. DTO validation se runtime errors kam. |
| **Node.js** | ≥18 | Server runtime. Non-blocking I/O, same language frontend-backend. |

### Database ORM

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **Mongoose** | 9.2.1 | MongoDB ka ODM (Object Document Mapper). Schema definition, validation, queries easy. |
| **@nestjs/mongoose** | 11.0.4 | Mongoose ko NestJS module system mein integrate karta hai. |

### Authentication

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **Passport.js** | 0.7.0 | Authentication middleware. Strategy pattern – JWT strategy plug kiya. |
| **passport-jwt** | 4.0.1 | JWT token verify karne ki strategy. |
| **@nestjs/jwt** | 11.0.2 | JWT sign/verify NestJS style mein. |
| **bcrypt** | 6.0.0 | Password hashing. Rainbow table attacks se bachao. Salt rounds configurable. |

### Validation & Transformation

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **class-validator** | 0.14.3 | DTO fields pe decorators se validation (`@IsString`, `@IsEmail`, etc.) |
| **class-transformer** | 0.5.1 | Plain objects ko class instances mein convert karta hai. `@Type()` nested DTO ke liye. |

### File Upload

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **Multer** | 2.0.2 | Multipart form data handle karta hai. Disk storage se files save. |

### Dev Tools

| Technology | Version | Kyun Use Kiya |
|------------|---------|---------------|
| **Nodemon** | 3.1.11 | File change detect karke server auto-restart. Dev mein speed badhata hai. |
| **Jest** | 29.5.0 | Unit testing framework. |
| **Prettier** | 3.0.0 | Code formatting consistent rakhta hai. |

---

## 5. Database

### MongoDB (via Atlas or Local)

```
Database: vensar-drive
│
├── users              ← Login, roles, profile
├── services           ← Irrigation, Railways etc.
├── projects           ← Service ke under projects
├── folders            ← Nested folder tree (parentId se linked)
└── filemetadatas      ← File metadata (actual file disk par)
```

**Kyun MongoDB?**
- Flexible schema – project ke custom fields (label-value pairs) easily store hote hain
- Nested documents (majorComponents array) natural way mein
- Horizontal scaling easy
- Mongoose ke saath NestJS mein bahut smooth integration

**Folder Tree Structure (parentId pattern):**
```
folders collection:
  { _id: "A", name: "irrigation",       parentId: null,  serviceId: "irrigation" }
  { _id: "B", name: "kayampur-sitamau", parentId: "A",   serviceId: "irrigation", projectId: "kayampur-sitamau" }
  { _id: "C", name: "Civil",            parentId: "B",   serviceId: "irrigation", projectId: "kayampur-sitamau" }
  { _id: "D", name: "Drawings",         parentId: "C",   serviceId: "irrigation", projectId: "kayampur-sitamau" }
```

---

## 6. Authentication & Security

### Flow Diagram

```
┌──────────┐     1. POST /auth/login           ┌──────────────┐
│  Client  │ ────────────────────────────────► │   Backend    │
│          │     { email, password }            │              │
│          │                                    │  Verify OTP  │
│          │ ◄────────────────────────────────  │  Generate JWT│
│          │     2. OTP sent to mobile          └──────────────┘
│          │
│          │     3. POST /auth/verify-otp        ┌──────────────┐
│          │ ────────────────────────────────►  │   Backend    │
│          │     { email, otp }                  │              │
│          │                                     │  Validate OTP│
│          │ ◄────────────────────────────────   │  Return JWT  │
│          │     4. { token, user }              └──────────────┘
│          │
│          │  5. Token encrypted with crypto-js
│          │     → sessionStorage mein store
│          │
│          │     6. All API calls: Bearer <token>
│          │ ────────────────────────────────►  ┌──────────────┐
│          │                                    │  JWT Guard   │
│          │                                    │  Role Guard  │
│          │ ◄────────────────────────────────  │  Response    │
└──────────┘                                    └──────────────┘
```

### Security Measures

| Measure | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt (10 salt rounds) |
| **Token Encryption** | crypto-js AES in sessionStorage |
| **JWT Validation** | passport-jwt strategy |
| **Role Guard** | `@Roles()` decorator + `RolesGuard` |
| **DTO Whitelist** | class-validator strips unknown fields |
| **CORS** | Configured origin allowlist |

---

## 7. File Storage

```
vensar-drive-backend/
└── uploads/              ← Actual files disk par stored hain
    ├── 1708001234-abc123.pdf
    ├── 1708001235-def456.png
    └── ...

MongoDB (filemetadatas collection):
  {
    name: "original_filename.pdf",
    mimeType: "application/pdf",
    size: 245670,
    storagePath: "1708001234-abc123.pdf",   ← disk par file ka naam
    folderId: "folder_object_id",
    serviceId: "irrigation",
    projectId: "kayampur-sitamau"
  }
```

**Download Flow:**
```
Client → GET /files/:id/download
       → Backend reads storagePath from DB
       → Streams file from disk
       → Content-Disposition: attachment header
       → Client receives file
```

**Image Preview Flow:**
```
Client (ImageThumbnail component)
  → fetch('/files/:id/download', { headers: { Authorization: Bearer token } })
  → Blob URL create karo
  → <img src={blobUrl} />
  → Cleanup: URL.revokeObjectURL on unmount
```

---

## 8. Module Structure

### Frontend (`vensar-drive/src/`)

```
src/
├── api/                  ← Backend API call functions
│   ├── client.ts         ← Axios instance (interceptors, base URL)
│   ├── servicesApi.ts    ← Services CRUD
│   ├── projectsApi.ts    ← Projects CRUD
│   ├── documentsApi.ts   ← Documents list/search
│   ├── filesApi.ts       ← File upload/download
│   ├── folders.ts        ← Folder CRUD
│   └── statesApi.ts      ← Indian states dropdown
│
├── hooks/                ← TanStack Query hooks (useQuery/useMutation)
│   ├── useServices.ts
│   ├── useProjects.ts
│   ├── useDocuments.ts
│   ├── useStates.ts
│   └── useFoldersFlat.ts
│
├── pages/
│   ├── auth/             ← LoginPage
│   ├── dashboard/        ← DashboardPage (Services list)
│   ├── services/
│   │   ├── ServicesPage.tsx          ← All services grid
│   │   ├── ServiceProjectsPage.tsx   ← Projects under a service
│   │   ├── ProjectDetailsPage.tsx    ← Project detail + Documents tab
│   │   ├── CreateServicePage.tsx     ← Admin: create service
│   │   └── CreateProjectPage.tsx     ← Admin: create project
│   ├── documents/        ← My Documents page
│   └── users/            ← User management
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx   ← Wrapper (sidebar + topbar)
│   │   ├── DashboardSidebar.tsx  ← Left navigation
│   │   ├── DashboardTopBar.tsx   ← Top bar
│   │   ├── NavPathTree.tsx       ← Dynamic path tree in sidebar
│   │   └── SidebarContext.tsx    ← Sidebar open/close state
│   └── documnets/
│       ├── FileExplorer.tsx      ← Main document manager (OneDrive-like)
│       ├── CreateFolderDialog.tsx
│       └── RenameDialog.tsx
│
├── contexts/
│   ├── AuthContext.tsx        ← User state, login/logout
│   ├── ToastContext.tsx       ← Global notifications
│   └── NavigationContext.tsx  ← Current folder tracking (sidebar)
│
├── store/                ← Redux (auth only)
├── theme/                ← MUI theme customization
└── data/                 ← Static data (icon registry)
```

### Backend (`vensar-drive-backend/src/`)

```
src/
├── auth/                 ← Login, OTP, JWT strategy
├── users/                ← User CRUD, roles
├── services/             ← Service CRUD + seed
├── projects/             ← Project CRUD (per service)
├── folders/              ← Folder CRUD, recursive delete, ensure-root
├── files/                ← File upload/download, batch upload
├── documents/            ← Aggregated list API (folders + files)
├── states/               ← Indian states static list
├── upload/               ← Generic file upload utility
└── common/
    ├── guards/           ← JWT Guard, Roles Guard
    ├── decorators/       ← @Roles(), @CurrentUser()
    └── filters/          ← Global error handler
```

---

## 9. API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Email+password se OTP bhejo | ❌ |
| POST | `/auth/verify-otp` | OTP verify, JWT return | ❌ |
| POST | `/auth/register/request-otp` | Admin: new user register OTP | ✅ Admin |
| POST | `/auth/register/verify-otp` | Verify register OTP | ❌ |

### Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services` | Sab services list | ✅ All |
| GET | `/services/:serviceId` | Ek service | ✅ All |
| POST | `/services` | Create service | ✅ Admin |
| PATCH | `/services/:serviceId` | Update service | ✅ Admin |
| DELETE | `/services/:serviceId` | Delete service | ✅ Admin |
| POST | `/services/seed` | Initial services seed | ✅ Admin |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects?serviceId=x` | Service ke projects | ✅ All |
| GET | `/projects/:serviceId/:projectId` | Ek project detail | ✅ All |
| POST | `/projects/:serviceId` | Create project | ✅ Admin |
| PATCH | `/projects/:serviceId/:projectId` | Update project | ✅ Admin |
| DELETE | `/projects/:serviceId/:projectId` | Delete project | ✅ Admin |
| POST | `/projects/seed/irrigation` | Sample project seed | ✅ Admin |

### Documents (Aggregated)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/documents?serviceId=x&projectId=y` | Project ke folders+files | ✅ All |
| GET | `/documents?folderId=x` | Subfolder contents | ✅ All |
| GET | `/documents/search?q=x` | Name se search | ✅ All |

### Folders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/folders` | Sab folders (flat) | ✅ All |
| POST | `/folders` | Create folder | ✅ Admin |
| POST | `/folders/ensure-root` | Project root ensure | ✅ Admin |
| PATCH | `/folders/:id` | Rename/move folder | ✅ Admin |
| DELETE | `/folders/:id` | Delete empty folder | ✅ Admin |
| DELETE | `/folders/:id/recursive` | Recursive delete | ✅ Admin |

### Files
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/files/upload` | Single file upload | ✅ Admin |
| POST | `/files/upload-batch` | Multiple files upload | ✅ Admin |
| GET | `/files/:id/download` | File download/stream | ✅ All |
| PATCH | `/files/:id` | Rename/move file | ✅ Admin |
| DELETE | `/files/:id` | Delete file | ✅ Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Sab users list | ✅ Admin |
| PATCH | `/users/:id/role` | Role change | ✅ Super Admin |
| PATCH | `/users/:id/active` | Enable/disable | ✅ Admin |

---

## 10. UI Screens

### 🏠 Services Page (Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] OneDrive    Dashboard  Documents  Configuration▼       │
├──────────┬──────────────────────────────────────────────────────┤
│          │  ┌────────────────────────────────────────────────┐  │
│ Services │  │  🔧 Services                    [Create Service]│  │
│          │  │  ─────────────────────────────────────────────│  │
│My Docs   │  │  [Search...]                                    │  │
│          │  │                                                  │  │
│          │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │
│          │  │  │ 💧       │ │ ⚡        │ │ 🚂       │        │  │
│          │  │  │Irrigation│ │Hydro Pwr │ │ Railways │        │  │
│          │  │  └──────────┘ └──────────┘ └──────────┘        │  │
│[Logout]  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │
└──────────┘  │  │ 🏗️       │ │ 🏢       │ │ ✈️       │        │  │
              │  │Transmissn│ │Commercial│ │ Airports │        │  │
              │  └──────────┘ └──────────┘ └──────────┘        │  │
              └────────────────────────────────────────────────┘  │
```

**Features:**
- Services grid layout (responsive: 2-6 columns)
- Irrigation **hamesha top** par (sort logic)
- Icon fallback – backend icon na ho to serviceId se match
- Admin: "Create Service" + "Seed initial services"

---

### 📁 Service Projects Page

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Services    Services / Irrigation                  │
│ Projects (4)                                                 │
│ ──────────────────────────────────────────────────────────── │
│ [Search...] [State: MP ▼]                   [Create Project] │
│                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────┐   │
│ │ 📁 Kayampur Sitamau PILMI│ │ 📁 Maa Rewa LIR          │   │
│ │    [MP]                  │ │    [MP]               →  │   │
│ └──────────────────────────┘ └──────────────────────────┘   │
│ ┌──────────────────────────┐                                 │
│ │ 📁 Chentikheda PILMI     │                                 │
│ │    [MP]               →  │                                 │
│ └──────────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```

**Sidebar state:**
```
🔧 Services
   └─ 💠 Irrigation    (clickable)
```

---

### 🗂️ Project Details Page

```
┌───────────────────────────────────────────────────────────────┐
│ ← Back to Projects                                            │
│ KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT MAJOR IRRIGATION...   │
│ ─────────────────────────────────────────────────────────── │
│ [Project Details]  [Documents]                                │
│                                                               │
│  Client: Water Resources Dept MP  │ Contractor: VENSAR MP JV │
│  Total Flow Rate: 133203.31 m³/h  │ Total CCA: 1,12,124 HA   │
│                                                               │
│  Work Scope: Design, supply, erection... [full text]          │
│                                                               │
│  Major Components:                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Sr No │ Component                        │ Qty          │ │
│  │   1   │ Number of Pumping Station        │ 2            │ │
│  │   2   │ Delivery Chamber (DC)            │ 1            │ │
│  │   3   │ Outlet Management System (OMS)   │ 3841         │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**Sidebar state:**
```
🔧 Services
   └─ 💠 Irrigation    (clickable)
      └─ 📁 Kayampur Sitamau   (active, green)
```

---

### 📄 Documents Tab (OneDrive Style)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Search docs...] [≡ List] [⊞ Grid]    [+ New ▼]  [↑ Upload]   │
│ 🏠 > kayampur-sitamau > Civil > Drawings                        │
│ ─────────────────────────────────────────────────────────────── │
│                                                                  │
│ Grid View:                                                       │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│ │ 📁       │  │ 📁       │  │ [IMAGE]  │  │ [IMAGE]  │         │
│ │ FDB813   │  │ FDB813   │  │ photo.jpg│  │plan.png  │         │
│ │ Civil    │  │Mechanical│  │ 245 KB   │  │ 1.2 MB   │         │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│ ┌──────────┐  ┌──────────┐                                      │
│ │ 📄 PDF   │  │ 📊 Excel │                                      │
│ │ report   │  │ data.xlsx│                                      │
│ └──────────┘  └──────────┘                                      │
│                                                                  │
│ Drag & Drop to upload files here                                 │
│ 2 folders · 4 files · 3.4 MB                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Grid view mein image files → actual thumbnail preview (auth-aware fetch)
- Non-image files → icon (PDF=red, Excel=green, etc.)
- Folders → yellow folder icon
- Drag & drop file upload
- "Upload Folder" → poori folder structure ke saath upload (webkitdirectory)
- Right-click context menu: Rename, Delete, Download
- Nested folders navigate kar sakte hain (OneDrive style)
- Breadcrumb navigation

---

### 👥 Create Project Form (Admin)

```
┌────────────────────────────────────────────────────────────────┐
│ ← Back to projects                                             │
│ ➕ Create Project  under Irrigation                             │
│ ──────────────────────────────────────────────────────────── │
│ Project Name: [KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT...]    │
│ Project ID:   [kayampur-sitamau]  (auto-generated slug)        │
│ Short Name:   [Kayampur Sitamau PILMI]                         │
│ State:        [Madhya Pradesh (MP) ▼]                          │
│ Title:        [optional]                                        │
│ Work Scope:   [textarea...]                                     │
│                                                                 │
│ Custom Fields (Client, Contractor etc.)          [+ Add field] │
│ ┌─────────────────────────┬────────────────────────────────┐   │
│ │ Label      │ Value       │                               │   │
│ │ Client     │ WRD MP      │ [🗑️]                          │   │
│ │ Work Order │ EI557WOD... │ [🗑️]                          │   │
│ │ Total CCA  │ 1,12,124 HA │ [🗑️]                          │   │
│ └─────────────────────────┴────────────────────────────────┘   │
│                                                                 │
│ Major Components                            [+ Add component]  │
│ ┌──────┬──────────────────────────────┬───────┐               │
│ │ Sr No│ Component                    │  Qty  │               │
│ │  1   │ Number of Pumping Station    │   2   │ [🗑️]          │
│ │  2   │ Delivery Chamber (DC)        │   1   │ [🗑️]          │
│ └──────┴──────────────────────────────┴───────┘               │
│                                          [Cancel] [Create ✓]  │
└────────────────────────────────────────────────────────────────┘
```

---

## 11. Role-Based Access Control

### Roles

| Role | Description |
|------|-------------|
| **super_admin** | Sab kuch kar sakta hai, roles bhi change kar sakta hai |
| **admin** | Services, projects, folders, files create/edit/delete |
| **user** | Sirf read access – services, projects, documents dekh sakta hai |

### Permission Matrix

| Feature | super_admin | admin | user |
|---------|-------------|-------|------|
| View Services | ✅ | ✅ | ✅ |
| Create/Edit Service | ✅ | ✅ | ❌ |
| View Projects | ✅ | ✅ | ✅ |
| Create/Edit Project | ✅ | ✅ | ❌ |
| View Documents | ✅ | ✅ | ✅ |
| Upload Files | ✅ | ✅ | ❌ |
| Create Folders | ✅ | ✅ | ❌ |
| Delete Folders | ✅ | ✅ | ❌ |
| View Users | ✅ | ✅ | ❌ |
| Create Users | ✅ | ✅ | ❌ |
| Change Roles | ✅ | ❌ | ❌ |

---

## 12. Data Flow Diagram

### Service → Project → Document Flow

```
User Opens App
     │
     ▼
ServicesPage (GET /services)
     │
     │  Click on Irrigation
     ▼
ServiceProjectsPage (GET /projects?serviceId=irrigation)
     │
     │  Click on Kayampur Sitamau
     ▼
ProjectDetailsPage (GET /projects/irrigation/kayampur-sitamau)
     │
     ├─── Tab 0: Project Details (static from DB)
     │         ├── Custom Fields (Client, Work Order...)
     │         └── Major Components table
     │
     └─── Tab 1: Documents
               │
               ▼
          FileExplorer
               │
               ├── GET /documents?serviceId=irrigation&projectId=kayampur-sitamau
               │        └── Returns: rootFolder + folders[] + files[]
               │
               ├── Navigate into subfolder
               │        └── GET /documents?folderId=<id>
               │
               ├── Upload File: POST /files/upload (with auth + folderId)
               │
               ├── Upload Folder:
               │        1. POST /folders (create folder structure)
               │        2. POST /files/upload (each file)
               │
               └── Delete Folder: DELETE /folders/:id/recursive
                        └── Deletes all subfolders + files
```

---

## 🔗 Project Links

| Item | Detail |
|------|--------|
| Frontend repo | `k:\Vensar\vensar-drive` |
| Backend repo | `k:\Vensar\vensar-drive-backend` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| API Base | `http://localhost:3000` (VITE_API_URL env var) |
| MongoDB | Local / Atlas (MONGODB_URI env var) |

---

## 🚀 Getting Started

### Backend
```bash
cd vensar-drive-backend
npm install
# .env file mein set karo:
# MONGODB_URI=mongodb://localhost:27017/vensar-drive
# JWT_SECRET=your_secret
# UPLOAD_DIR=./uploads
npm run start:dev
```

### Frontend
```bash
cd vensar-drive
npm install
# .env file mein set karo:
# VITE_API_URL=http://localhost:3000
npm run dev
```

### First Run
1. Backend start karo
2. Admin account banao (seed ya register)
3. Services page pe "Seed initial services" click karo
4. Irrigation → "Seed sample project" click karo
5. Project details → Documents tab → Folders banao

---

*Document prepared for Vensar Engineering Solutions | Internal Use Only*
