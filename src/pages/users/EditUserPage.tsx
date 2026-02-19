import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import EditOutlined from '@mui/icons-material/EditOutlined'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { getUsers, updateUser } from '@/api/usersApi'
import { rolesCreatableBy, type UserRole } from '@/constants/roles'
import { editUserSchema, type EditUserFormValues } from '@/schemas/createUserSchema'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
}

export function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; role: UserRole } | null>(null)

  const creatableRoles = rolesCreatableBy(currentUser?.role)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      role: 'user',
      address: '',
      designation: '',
      isActive: true,
    },
  })

  const formValues = watch()

  const fetchUser = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const users = await getUsers()
      const u = users.find((x) => x.id === id || x._id === id)
      if (!u) {
        showToast('User not found', 'error')
        navigate('/users')
        return
      }
      setUserData({ name: u.name, email: u.email, role: u.role })
      reset({
        name: u.name,
        email: u.email,
        mobile: u.mobile ?? '',
        role: u.role,
        address: u.address ?? '',
        designation: u.designation ?? '',
        isActive: u.isActive,
      })
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load user', 'error')
      navigate('/users')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, reset, showToast])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const onSubmitClick = () => {
    setShowConfirm(true)
  }

  const onConfirmSave = async () => {
    if (!id) return
    setSubmitting(true)
    try {
      await updateUser(id, {
        name: formValues.name,
        email: formValues.email,
        mobile: formValues.mobile || undefined,
        role: formValues.role as UserRole,
        address: formValues.address || undefined,
        designation: formValues.designation || undefined,
        isActive: formValues.isActive,
      })
      showToast('User updated successfully', 'success')
      setShowConfirm(false)
      navigate('/users')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update user', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const onCancelConfirm = () => {
    if (!submitting) setShowConfirm(false)
  }

  const canEditRole = currentUser?.role === 'super_admin' || (currentUser?.role === 'admin' && userData?.role === 'user')

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} size="small">
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EditOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700}>
              Edit User
            </Typography>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmitClick)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('name')}
              label="Name"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="filled"
            />
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="filled"
            />
            <TextField
              {...register('mobile')}
              label="Mobile"
              fullWidth
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
              variant="filled"
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth variant="filled" size="medium" disabled={!canEditRole}>
                  <InputLabel id="edit-user-role-label">Role</InputLabel>
                  <Select labelId="edit-user-role-label" label="Role" {...field}>
                    {creatableRoles.map((r) => (
                      <MenuItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={!!field.value} />}
                  label="Active"
                />
              )}
            />
            <TextField
              {...register('address')}
              label="Address"
              fullWidth
              multiline
              rows={2}
              variant="filled"
            />
            <TextField
              {...register('designation')}
              label="Designation"
              fullWidth
              variant="filled"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button variant="outlined" onClick={() => navigate('/users')}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>

        <ConfirmationModal
          open={showConfirm}
          title="Save Changes"
          message={`Are you sure you want to save changes for "${formValues.name}"?`}
          confirmLabel="Save"
          confirmColor="primary"
          onConfirm={onConfirmSave}
          onCancel={onCancelConfirm}
          loading={submitting}
        />
      </Box>
    </DashboardLayout>
  )
}
