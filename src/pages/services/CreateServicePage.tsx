import { Box, Typography, Paper } from '@mui/material'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'

/**
 * Super Admin: Create new service. Backend integration pending.
 */
export function CreateServicePage() {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <AddCircleOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Create Service
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Create service form will be added here. Super admin can add new services.
        </Paper>
      </Box>
    </DashboardLayout>
  )
}
