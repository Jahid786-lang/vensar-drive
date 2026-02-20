import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { DashboardTopBar } from './DashboardTopBar'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardFooter } from './DashboardFooter'
import { SidebarProvider, useSidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOP_BAR_HEIGHT } from './SidebarContext'

interface DashboardLayoutProps {
  children: React.ReactNode,
  title?: string
}

function DashboardLayoutInner({ children, title }: DashboardLayoutProps) {
  const theme = useTheme()
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'))

  return (
    <SidebarProvider isMobile={isMobile}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
        <DashboardTopBar />
        <DashboardSidebar />
        <DashboardMain>{children}</DashboardMain>
        {/* <DashboardFooter /> */}
      </Box>
    </SidebarProvider>
  )
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const { sidebarOpen, isMobile } = useSidebar()

  const sidebarWidth = isMobile ? 0 : sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        mt: { xs: '56px', sm: `${TOP_BAR_HEIGHT}px` },
        ml: 0,
        width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
        minHeight: { xs: 'calc(100vh - 56px)', sm: `calc(100vh - ${TOP_BAR_HEIGHT}px)` },
        // pt: { xs: 1, sm: 2 },
        pb: 6,
        // px: { xs: 0.5, sm: 2 },
        transition: theme.transitions.create(['width', 'margin'], { duration: theme.transitions.duration.enteringScreen }),
      }}
    >
      {children}
    </Box>
  )
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return <DashboardLayoutInner title={title}>{children}</DashboardLayoutInner>
}
