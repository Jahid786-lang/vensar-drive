import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AddServiceForm } from '@/components/admin/AddServiceForm'

export function AdminPage() {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%', p: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'primary.dark',
              mb: 0.5,
            }}
          >
            Add Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Only admin users can add new services. New services will appear on the Services page.
          </Typography>
          <AddServiceForm />
        </Paper>
      </Box>
    </DashboardLayout>
  )
}
