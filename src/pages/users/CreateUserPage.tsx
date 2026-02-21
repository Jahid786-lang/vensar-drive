import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AppInput } from '@/components/AppInput'
import { AppButton } from '@/components/AppButton'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { createUser } from '@/api/usersApi'
import { rolesCreatableBy, type UserRole } from '@/constants/roles'
import { createUserSchema, type CreateUserFormValues } from '@/schemas/createUserSchema'
import './CreateUserPage.css'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

const formControlSx = {
  '& .MuiFilledInput-root': {
    borderRadius: 2,
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      backgroundColor: 'background.paper',
      borderColor: 'primary.light',
    },
    '&.Mui-focused': {
      backgroundColor: 'background.paper',
      borderColor: 'primary.main',
      boxShadow: '0 0 0 2px rgba(0,150,136,0.2)',
    },
    '&::before, &::after': { display: 'none' },
  },
}

export function CreateUserPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const creatableRoles = rolesCreatableBy(user?.role)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
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
      <Box
        className="create-user-page"
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        sx={{ maxWidth: '100%', mx: 'auto', px: { xs: 1 , sm: 2 }, py: 2 }}
      >
        <Box component={motion.div} variants={itemVariants}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/users')}
            size="small"
            sx={{ mb: 2, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
          >
            Back to Users
          </Button>
        </Box>

        <Box
          className="create-user-header-card"
          component={motion.div}
          variants={itemVariants}
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box className="create-user-header-icon-wrap">
              <PersonAddOutlined sx={{ fontSize: 30, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', letterSpacing: '-0.02em' }}>
                Create User
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.25 }}>
                {user?.role === 'super_admin'
                  ? 'Assign any role to the new user.'
                  : 'Create users with the User role only.'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper variant="outlined" className="create-user-form-card" sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmitClick)}>
            <Grid container spacing={3}>
              {/* Left: Personal information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  className="create-user-section-panel"
                  component={motion.div}
                  variants={itemVariants}
                >
                  <Box className="create-user-section-title">
                    <PersonOutlined sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      Personal information
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <AppInput
                        {...field}
                        id="create-user-name"
                        label="Full name"
                        required
                        placeholder="e.g. John Doe"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field, fieldState }) => (
                      <AppInput
                        {...field}
                        id="create-user-mobile"
                        label="Mobile"
                        placeholder="e.g. +1 234 567 8900"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="designation"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        id="create-user-designation"
                        label="Designation"
                        placeholder="e.g. Developer"
                      />
                    )}
                  />
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        id="create-user-address"
                        label="Address"
                        multiline
                        rows={2}
                        placeholder="Street, city, country"
                      />
                    )}
                  />
                  </Box>
                </Box>
              </Grid>

              {/* Right: Account details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  className="create-user-section-panel account"
                  component={motion.div}
                  variants={itemVariants}
                >
                  <Box className="create-user-section-title">
                    <LockOutlined sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      Account details
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <AppInput
                          {...field}
                          id="create-user-email"
                          label="Email"
                          type="email"
                          required
                          placeholder="user@example.com"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState }) => (
                        <AppInput
                          {...field}
                          id="create-user-password"
                          label="Password"
                          type="password"
                          required
                          showPasswordToggle
                          placeholder="Min. 6 characters"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth variant="filled" sx={formControlSx}>
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
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
            >
              <Button variant="outlined" onClick={() => navigate('/users')}>
                Cancel
              </Button>
              <AppButton
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<PersonAddOutlined />}
                loading={submitting}
              >
                Create User
              </AppButton>
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
