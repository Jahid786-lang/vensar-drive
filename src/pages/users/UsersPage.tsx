import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import PeopleOutlined from '@mui/icons-material/PeopleOutlined'
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlined from '@mui/icons-material/ToggleOffOutlined'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { getUsers, deleteUser, toggleUserActive, type UserListItem } from '@/api/usersApi'
import { type UserRole } from '@/constants/roles'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
}

type ConfirmAction = 'delete' | 'activate' | 'deactivate' | null

export function UsersPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteClick = (u: UserListItem) => {
    setSelectedUser(u)
    setConfirmAction('delete')
  }

  const handleActivateClick = (u: UserListItem) => {
    setSelectedUser(u)
    setConfirmAction(u.isActive ? 'deactivate' : 'activate')
  }

  const handleConfirm = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      if (confirmAction === 'delete') {
        await deleteUser(selectedUser.id)
        showToast('User deleted successfully', 'success')
        await fetchUsers()
      } else if (confirmAction === 'activate') {
        await toggleUserActive(selectedUser.id, true)
        showToast('User activated successfully', 'success')
        await fetchUsers()
      } else if (confirmAction === 'deactivate') {
        await toggleUserActive(selectedUser.id, false)
        showToast('User deactivated successfully', 'success')
        await fetchUsers()
      }
      setConfirmAction(null)
      setSelectedUser(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Operation failed', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelConfirm = () => {
    if (!actionLoading) {
      setConfirmAction(null)
      setSelectedUser(null)
    }
  }

  const canEditUser = (u: UserListItem) => {
    if (!currentUser) return false
    if (currentUser.role === 'super_admin') return true
    if (currentUser.role === 'admin') return u.role === 'user'
    return false
  }

  const canDeleteUser = (u: UserListItem) => canEditUser(u)
  const canToggleActive = (u: UserListItem) => canEditUser(u)

  const confirmConfig = {
    delete: {
      title: 'Delete User',
      message: selectedUser
        ? `Are you sure you want to delete "${selectedUser.name}" (${selectedUser.email})? This action cannot be undone.`
        : '',
      confirmLabel: 'Delete',
      confirmColor: 'error' as const,
    },
    activate: {
      title: 'Activate User',
      message: selectedUser
        ? `Are you sure you want to activate "${selectedUser.name}"?`
        : '',
      confirmLabel: 'Activate',
      confirmColor: 'success' as const,
    },
    deactivate: {
      title: 'Deactivate User',
      message: selectedUser
        ? `Are you sure you want to deactivate "${selectedUser.name}"? They will not be able to log in.`
        : '',
      confirmLabel: 'Deactivate',
      confirmColor: 'warning' as const,
    },
  }

  const config = confirmAction ? confirmConfig[confirmAction] : null

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PeopleOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700}>
              Users
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAddOutlined />} onClick={() => navigate('/users/create')}>
            Create User
          </Button>
        </Box>

        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, color: 'text.secondary' }}>
              No users found. Create your first user.
            </Box>
          ) : (
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.mobile ?? '—'}</TableCell>
                      <TableCell>
                        <Chip label={ROLE_LABELS[u.role]} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={u.isActive ? 'success' : 'default'}
                          variant={u.isActive ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>{u.createdByName ?? '—'}</TableCell>
                      <TableCell align="right">
                        {canEditUser(u) && (
                          <IconButton
                            size="small"
                            aria-label="Edit"
                            onClick={() => navigate(`/users/${u.id}/edit`)}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        )}
                        {canToggleActive(u) && (
                          <IconButton
                            size="small"
                            aria-label={u.isActive ? 'Deactivate' : 'Activate'}
                            onClick={() => handleActivateClick(u)}
                          >
                            {u.isActive ? (
                              <ToggleOffOutlined fontSize="small" color="warning" />
                            ) : (
                              <ToggleOnOutlined fontSize="small" color="success" />
                            )}
                          </IconButton>
                        )}
                        {canDeleteUser(u) && (
                          <IconButton
                            size="small"
                            aria-label="Delete"
                            color="error"
                            onClick={() => handleDeleteClick(u)}
                          >
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {config && confirmAction && (
          <ConfirmationModal
            open={!!confirmAction}
            title={config.title}
            message={config.message}
            confirmLabel={config.confirmLabel}
            confirmColor={config.confirmColor}
            onConfirm={handleConfirm}
            onCancel={handleCancelConfirm}
            loading={actionLoading}
          />
        )}
      </Box>
    </DashboardLayout>
  )
}
