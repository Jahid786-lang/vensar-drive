import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AdminRoute } from '@/routes/AdminRoute'
import { AdminOrSuperAdminRoute } from '@/routes/AdminOrSuperAdminRoute'
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AdminPage } from '@/pages/admin/AdminPage'
import { ServiceProjectsPage } from '@/pages/services/ServiceProjectsPage'
import { ProjectDetailsPage } from '@/pages/services/ProjectDetailsPage'
import { CreateServicePage } from '@/pages/services/CreateServicePage'
import { CreateProjectPage } from '@/pages/services/CreateProjectPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { CreateUserPage } from '@/pages/users/CreateUserPage'
import { EditUserPage } from '@/pages/users/EditUserPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import './App.css'
import DocumentsPage from './pages/documents'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/create"
          element={
            <AdminOrSuperAdminRoute>
              <CreateServicePage />
            </AdminOrSuperAdminRoute>
          }
        />
        <Route
          path="/services/:serviceId"
          element={
            <ProtectedRoute>
              <ServiceProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:serviceId/projects/create"
          element={
            <AdminOrSuperAdminRoute>
              <CreateProjectPage />
            </AdminOrSuperAdminRoute>
          }
        />
        <Route
          path="/services/:serviceId/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminOrSuperAdminRoute>
              <UsersPage />
            </AdminOrSuperAdminRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <AdminOrSuperAdminRoute>
              <CreateUserPage />
            </AdminOrSuperAdminRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <AdminOrSuperAdminRoute>
              <EditUserPage />
            </AdminOrSuperAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
