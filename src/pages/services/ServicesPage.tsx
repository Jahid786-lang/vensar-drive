import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import AppsOutlined from '@mui/icons-material/AppsOutlined'
import ArrowForward from '@mui/icons-material/ArrowForward'
import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import { useServices, useSeedServices } from '@/hooks/useServices'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { isAdminOrAbove } from '@/constants/roles'
import { iconRegistry } from '@/data/servicesData'
import type { SvgIconComponent } from '@mui/icons-material'
import BoltOutlined from '@mui/icons-material/BoltOutlined'

function getServiceIcon(serviceIcon: string | null, serviceId: string): SvgIconComponent {
  const iconId = serviceIcon || serviceId
  return (iconRegistry[iconId] ?? BoltOutlined) as SvgIconComponent
}

function ServiceCard({
  service,
  onSelect,
}: {
  service: { id: string; serviceId: string; serviceName: string; serviceIcon: string | null }
  onSelect: (id: string) => void
}) {
  const Icon = getServiceIcon(service.serviceIcon, service.serviceId)
  return (
    <Paper
        component="button"
        type="button"
        variant="outlined"
        onClick={() => onSelect(service.serviceId)}
        sx={{
          width: '100%',
          minHeight: 140,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          textAlign: 'center',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: 'primary.main',
            opacity: 0,
            transition: 'opacity 0.25s ease',
          },
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: (t) =>
              `0 12px 28px ${(t.palette.primary as unknown as Record<string, string>).alpha18 ?? 'rgba(0,150,136,0.18)'}`,
            transform: 'translateY(-4px)',
            bgcolor: 'primary.alpha6',
            '&::before': { opacity: 1 },
            '& .service-icon-wrap': {
              bgcolor: 'primary.main',
              color: 'white',
              transform: 'scale(1.05)',
            },
            '& .service-arrow': { opacity: 1, transform: 'translateX(0)' },
          },
          '&:active': { transform: 'translateY(-2px)' },
        }}
    >
      <Box
          className="service-icon-wrap"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.alpha12',
            color: 'primary.main',
            transition: 'all 0.25s ease',
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            lineHeight: 1.35,
            fontSize: '0.875rem',
            color: 'text.primary',
          }}
        >
          {service.serviceName}
        </Typography>
        <Box
          className="service-arrow"
          sx={{
            opacity: 0,
            transform: 'translateX(-4px)',
            transition: 'all 0.25s ease',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          <Typography variant="caption" fontWeight={600}>
            View projects
          </Typography>
          <ArrowForward sx={{ fontSize: 14 }} />
        </Box>
    </Paper>
  )
}

export function ServicesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const { showToast } = useToast()
  const { data: servicesList = [], isLoading, error } = useServices()
  const seedServices = useSeedServices()

  const handleSeed = async () => {
    try {
      const res = await seedServices.mutateAsync()
      showToast(`Seeded ${res.seeded} services`, 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Seed failed', 'error')
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? servicesList.filter((s) => s.serviceName.toLowerCase().includes(q))
      : [...servicesList]
    list = list.sort((a, b) => {
      if (a.serviceId === 'irrigation') return -1
      if (b.serviceId === 'irrigation') return 1
      return (a.serviceName ?? '').localeCompare(b.serviceName ?? '')
    })
    return list
  }, [search, servicesList])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography color="text.secondary">Loading services...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Failed to load services'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: 'auto',
        width: '100%',
        minWidth: 0,
        py: { xs: 0.5, sm: 1 },
      }}
    >
      {/* Hero header */}
      <Box
        sx={{
          mb: 2,
          p: { xs: 1, sm: 0.5 },
          borderRadius: 2,
          background: (t) =>
            `linear-gradient(135deg, ${(t.palette.primary as unknown as Record<string, string>).alpha8 ?? 'rgba(0,150,136,0.08)'} 0%, ${(t.palette.primary as unknown as Record<string, string>).alpha12 ?? 'rgba(0,150,136,0.12)'} 100%)`,
          border: '0.5px solid',
          borderColor: 'primary.alpha20',
        }}
      >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppsOutlined sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                letterSpacing: '-0.02em',
                fontSize: { xs: '0.25rem', sm: '0.5rem', md: '1rem' },
              }}
            >
              Services ({filtered.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: { xs: '0.25rem', sm: '0.75rem' } }}>
              Choose a service to view related projects
            </Typography>
          </Box>
          </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            // mt: 2,
            maxWidth: { xs: '100%', sm: 380 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.light',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          }}
        />
        {/* <Button
          variant="contained"
          size="small"
          startIcon={<AddCircleOutlined />}
          onClick={() => navigate('/services/create')}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Create Service
        </Button> */}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 1.5,
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((service) => (
            <ServiceCard
              key={service.serviceId}
              service={service}
              onSelect={(id) => navigate(`/services/${id}`)}
            />
          ))
        ) : servicesList.length === 0 ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              py: 8,
              px: 2,
              borderRadius: 3,
              bgcolor: 'action.hover',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <AppsOutlined sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              No services yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5, mb: 2 }}>
              Create your first service to get started
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlined />}
                onClick={() => navigate('/services/create')}
                sx={{ textTransform: 'none' }}
              >
                Create Service
              </Button>
              {isAdminOrAbove(user?.role) && (
                <Button
                  variant="outlined"
                  onClick={handleSeed}
                  disabled={seedServices.isPending}
                  sx={{ textTransform: 'none' }}
                >
                  {seedServices.isPending ? 'Seeding...' : 'Seed initial services'}
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              py: 8,
              px: 2,
              borderRadius: 3,
              bgcolor: 'action.hover',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <SearchOffOutlined sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              No services match &quot;{search}&quot;
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
              Try a different search term
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
