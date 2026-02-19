# Role-Based UI Architecture

This document describes how the app shows different menus and screens based on user role. Goal: **clean code**, **no loading flicker**, **easy to extend** for new roles or menu items.

---

## 1. Roles

| Role         | Value (backend/frontend) | Description                    |
| ------------ | ------------------------ | ------------------------------ |
| Super Admin  | `super_admin`            | Full access: Services CRUD, User CRUD (any role), Project create, all admin features |
| Admin        | `admin`                  | Can add Service, add Project, create Users with **User** role only (cannot create admin/super_admin) |
| User         | `user`                   | Default: Services view, My Documents, Profile |

- Role comes from **JWT / user object** after login. No extra API call for role.
- Stored in Redux + sessionStorage with the user so UI can decide menus/routes **immediately** (no loading flash).

---

## 2. Approach: Single Codebase, Config-Driven

- **One codebase** for all roles. No separate “super admin app” vs “user app”.
- **Sidebar and nav** are driven by **config per role**: e.g. `getSidebarConfig(role)` returns menu items (and optional sub-items) for that role.
- **Routes** are shared; **route guards** (e.g. `SuperAdminRoute`, `AdminRoute`) restrict who can open which path.
- **Pages** can be shared (e.g. Services list) or role-specific (e.g. User list for super_admin only). Prefer shared pages with optional “create” button or extra tabs when role allows.

Benefits:
- Developer reads one place for “what does super admin see?”
- No duplicate layout or auth logic.
- Smooth: role from stored user → config → render; no wait for role API.

---

## 3. Folder / File Structure

```
src/
├── config/
│   └── sidebarConfig.ts       # getSidebarConfig(role) → menu tree per role
├── constants/
│   └── roles.ts               # ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER, type UserRole
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx
│       ├── DashboardSidebar.tsx   # reads sidebar config by useAuth().user?.role
│       ├── SidebarNavItem.tsx     # single item or dropdown (children)
│       └── ...
├── routes/
│   ├── ProtectedRoute.tsx     # any logged-in user
│   ├── AdminRoute.tsx         # role === 'admin' || 'super_admin'
│   └── SuperAdminRoute.tsx    # role === 'super_admin' only (if needed)
├── store/
│   └── authSlice.ts          # User.role: UserRole
├── pages/
│   ├── dashboard/
│   ├── services/             # shared: ServicesPage, ServiceProjectsPage, ProjectDetailsPage
│   ├── admin/                 # admin/super_admin: AdminPage
│   ├── users/                 # super_admin: UserListPage, CreateUserPage (or modal)
│   └── ...
└── ...
```

- **sidebarConfig.ts**: Single source of truth for “which menu items and sub-items for which role”. Sidebar only renders what config returns.
- **roles.ts**: Central place for role string constants and TypeScript type so we don’t scatter `'super_admin'` everywhere.
- **DashboardSidebar**: Uses `useAuth().user?.role`, gets config from `getSidebarConfig(role)`, renders flat items or dropdowns (e.g. Services with children “All Services”, “Create Service”).
- **No separate “module” per role**: we only add **pages** (e.g. `users/`) and **config entries** for that role.

---

## 4. Sidebar Config Shape (Concept)

```ts
// Example structure (actual types in sidebarConfig.ts)

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType
  path?: string           // if no children, direct link
  pathPrefix?: string     // for “active” state: pathname.startsWith(pathPrefix)
  children?: NavItem[]    // if present → dropdown / expandable
  roles?: UserRole[]      // if omitted, show for all roles
}

// For user role (current behaviour):
// - Services (path: /, pathPrefix: /services)
// - My Documents (path: /documents)
// - Shared: Recent
// - Logout

// For super_admin:
// - Services (dropdown)
//   - All Services → /
//   - Create Service → /services/create (or we keep “Create” as button on Services page)
// - Users (dropdown)
//   - All Users → /users
//   - Create User → /users/create
// - My Documents
// - Shared: Recent
// - Logout
```

- **Create Service**: Sidebar dropdown “Create Service” + button on Services page. **Admin** and **super_admin** both can add service.
- **Create Project**: On the projects list page (per service), **admin** and **super_admin** see a “Create Project” button; route `/services/:serviceId/projects/create`.
- **Users**: Sub-menu “All Users” + “Create User” or single “Users” item that goes to list page with “Create user” button on page.

---

## 5. Route Protection

| Route(s)              | Who can access        | Guard / Note                    |
| --------------------- | --------------------- | ------------------------------- |
| `/`, `/services/*`, `/documents`, `/profile`, `/recent` | All authenticated     | `ProtectedRoute`                |
| `/admin`              | admin, super_admin    | `AdminRoute` (allow super_admin) |
| `/users`, `/users/create` | super_admin only      | `SuperAdminRoute` or role check in route |

- **AdminRoute**: Change from `user?.role !== 'admin'` to `user?.role !== 'admin' && user?.role !== 'super_admin'` so super_admin can open admin page.
- **SuperAdminRoute**: New guard for `/users` and `/users/create`; redirect to `/` if role is not `super_admin`.

---

## 6. Loading / No Flicker

- Role is part of **User** in Redux, loaded at login (verify OTP) and rehydrated from sessionStorage on refresh.
- Sidebar and layout use `useAuth().user?.role` (no async “fetch role”).
- Default role when missing: `user` (already in authSlice).
- So: **no extra loading state for role**; menu and routes are consistent as soon as user is in store.

---

## 7. Super Admin – Concrete Menu (Sidebar)

- **Services**  
  - Single menu item: “Services” → path `/` (or `/services`).  
  - On the **Services page**, show a top-right **“Create Service”** button when `role === 'super_admin'` (and later hide for others). No dropdown required if we use this button.

- **Users**  
  - **Super admin** and **admin** both see “Users” in sidebar (dropdown: All Users, Create User).  
  - **Create User**: Super admin can assign any role; admin can assign **User** only (see `rolesCreatableBy()` in constants/roles).

- **My Documents**  
  - Same as today: path `/documents`.

- **Shared with me**  
  - “Recent” etc. (unchanged).

- **Logout**  
  - Same for all roles.

So for super_admin we only need:
- Sidebar config that **adds** “Users” item (path `/users`) and keeps Services + My Documents.
- Services page: conditional “Create Service” button for super_admin.
- New **Users** page (list) with “Create User” button; routes `/users` and optionally `/users/create` protected by super_admin.

---

## 8. Backend Alignment

- Backend must return `role` in the user object (e.g. `super_admin` | `admin` | `user`).
- Auth slice maps backend `role` to `UserRole` and defaults unknown to `user`.
- If backend uses different strings, map them in `mapBackendUser()` (authSlice) once.

---

## 9. Adding a New Role Later

1. Add role value in **constants/roles.ts** and to type **UserRole** in authSlice.
2. In **config/sidebarConfig.ts**, add menu items for the new role (or add to `roles` array of existing items).
3. If needed, add **RouteGuard** for that role and use it in App.tsx.
4. Add any new pages (e.g. under `pages/xyz/`) and link from sidebar config.

No need for a separate “module” or app per role.

---

## 10. Summary

| Item              | Decision                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| Roles             | `super_admin`, `admin`, `user`                                           |
| Where role lives  | `User.role` from auth (Redux + sessionStorage); no extra API              |
| Sidebar           | Config-driven per role in `sidebarConfig.ts`; sidebar reads config       |
| Create Service    | Button on Services page for super_admin (optional: dropdown later)       |
| Users             | New “Users” menu item → `/users`; “Create User” on Users page or sub-item |
| Routes            | ProtectedRoute for all; AdminRoute for admin + super_admin; SuperAdminRoute for /users |
| Code style        | Single codebase; config + guards + conditional UI (e.g. buttons by role) |
| Loading           | No role-specific loading; use stored user                                 |

This keeps the project clean, readable, and smooth for users and developers.
