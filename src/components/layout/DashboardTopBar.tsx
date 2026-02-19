import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import HamburgerIcon from '@mui/icons-material/Menu'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from './SidebarContext'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Documents', path: '/documents' },
  // { label: 'Profile', path: '/profile' },
  { label: 'Reports', path: '/reports' },
  { label: 'Admin', path: '/admin' },
]

export function DashboardTopBar() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'))
  const { user } = useAuth()
  const { setMobileOpen } = useSidebar()
 
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar disableGutters sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}>
        {isMobile && (
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 0.5 }} aria-label="Open menu">
            <HamburgerIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 1, sm: 3 } }}>
          <img src="/logo.png" alt="Vensar Drive" style={{ height: 32, objectFit: 'contain' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            Drive
          </Typography>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: 'auto' }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={RouterLink}
              to={link.path}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
          <Button
            onClick={() => navigate('/profile')}
            size="small"
            sx={{
              color: 'text.primary',
              textTransform: 'none',
              '& .MuiButton-endIcon': { ml: 0.25 },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
              Welcome, {user?.name ?? user?.email?.split('@')[0] ?? 'User'}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'block', sm: 'none' } }}>
              {user?.name ?? 'User'}
            </Typography>
            {user?.avatar ?
              <img src={user?.avatar} alt="Vensar Drive" style={{ height: 32, objectFit: 'contain' }} /> :
              <AccountCircleIcon fontSize='medium' />}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
