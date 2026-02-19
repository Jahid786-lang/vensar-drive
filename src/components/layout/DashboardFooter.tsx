import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloudOutlined from '@mui/icons-material/CloudOutlined'
import ExpandMore from '@mui/icons-material/ExpandMore'

export function DashboardFooter() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        py: 0.75,
        px: 1.25,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CloudOutlined fontSize="small" color="action" />
      <Typography variant="caption" color="text.secondary">
        212.3 GB / 250 GB used
      </Typography>
      <IconButton size="small" sx={{ p: 0.25 }}>
        <ExpandMore fontSize="small" />
      </IconButton>
    </Box>
  )
}
