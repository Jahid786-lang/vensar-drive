import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import ArrowBack from '@mui/icons-material/ArrowBack'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

/**
 * Admin/Super Admin: Create new project under a service. Backend integration pending.
 */
export function CreateProjectPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box
          component="button"
          onClick={() => serviceId && navigate(`/services/${serviceId}`)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
            border: 0,
            background: 'none',
            cursor: 'pointer',
            color: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <ArrowBack fontSize="small" />
          Back to projects
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <AddCircleOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Create Project
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Create project form will be added here. Admin can add projects under this service.
        </Paper>
      </Box>
    </DashboardLayout>
  )
}
