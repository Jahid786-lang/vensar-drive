import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { createUser } from '@/api/usersApi'
import { rolesCreatableBy, type UserRole } from '@/constants/roles'
import { createUserSchema, type CreateUserFormValues } from '@/schemas/createUserSchema'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
}

export function CreateUserPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const creatableRoles = rolesCreatableBy(user?.role)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      mobile: '',
      role: creatableRoles[0] ?? 'user',
      address: '',
      designation: '',
    },
  })

  const formValues = watch()

  const onSubmitClick = () => {
    setShowConfirm(true)
  }

  const onConfirmCreate = async () => {
    setSubmitting(true)
    try {
      await createUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        mobile: formValues.mobile || undefined,
        role: formValues.role as UserRole,
        address: formValues.address || undefined,
        designation: formValues.designation || undefined,
      })
      showToast('User created successfully', 'success')
      setShowConfirm(false)
      navigate('/users')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create user', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const onCancelConfirm = () => {
    if (!submitting) setShowConfirm(false)
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} size="small">
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonAddOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700}>
              Create User
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {user?.role === 'super_admin'
            ? 'You can assign any role to the new user.'
            : 'You can create users with the User role only.'}
        </Typography>
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
              {...register('password')}
              label="Password"
              type="password"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password?.message}
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
                <FormControl fullWidth variant="filled" size="medium">
                  <InputLabel id="create-user-role-label">Role</InputLabel>
                  <Select
                    labelId="create-user-role-label"
                    label="Role"
                    {...field}
                  >
                    {creatableRoles.map((r) => (
                      <MenuItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                Create User
              </Button>
            </Box>
          </Box>
        </Paper>

        <ConfirmationModal
          open={showConfirm}
          title="Create User"
          message={`Are you sure you want to create user "${formValues.name}" (${formValues.email}) with role ${ROLE_LABELS[formValues.role as UserRole]}?`}
          confirmLabel="Create"
          confirmColor="primary"
          onConfirm={onConfirmCreate}
          onCancel={onCancelConfirm}
          loading={submitting}
        />
      </Box>
    </DashboardLayout>
  )
}
