import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import AppsOutlined from '@mui/icons-material/AppsOutlined'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import ArrowForward from '@mui/icons-material/ArrowForward'
import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector } from '@/store/hooks'
import { selectServicesList } from '@/store/servicesSlice'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminOrAbove } from '@/constants/roles'
import type { ServiceItem } from '@/data/servicesData'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
}

const itemMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

function ServiceCard({ service, onSelect }: { service: ServiceItem; onSelect: (id: string) => void }) {
  const Icon = service.icon
  return (
    <motion.div variants={itemMotion} style={{ height: '100%' }}>
      <Paper
        component="button"
        type="button"
        variant="outlined"
        onClick={() => onSelect(service.id)}
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 140,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
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
          {service.label}
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
    </motion.div>
  )
}

export function ServicesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const servicesList = useAppSelector(selectServicesList)
  const showCreateService = isAdminOrAbove(user?.role)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return servicesList
    return servicesList.filter((s) => s.label.toLowerCase().includes(q))
  }, [search, servicesList])

  return (
    <Box
      sx={{
        // maxWidth: 1100,
        mx: 'auto',
        width: '100%',
        minWidth: 0,
        // px: { xs: 2, sm: 3 },
        // py: { xs: 2, sm: 3 },
      }}
    >
      {/* Hero header */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 2 },
          borderRadius: 2,
          background: (t) =>
            `linear-gradient(135deg, ${(t.palette.primary as unknown as Record<string, string>).alpha8 ?? 'rgba(0,150,136,0.08)'} 0%, ${(t.palette.primary as unknown as Record<string, string>).alpha12 ?? 'rgba(0,150,136,0.12)'} 100%)`,
          border: '1px solid',
          borderColor: 'primary.alpha20',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
            <AppsOutlined sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              Services ({filtered.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Choose a service to view related projects
            </Typography>
          </Box>
          </Box>

        <TextField
          fullWidth
          size="medium"
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
            mt: 2,
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
        </Box>

      </Box>

      {/* Results count + grid */}
      {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {filtered.length} {filtered.length === 1 ? 'service' : 'services'} available
        </Typography>
        {showCreateService && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlined />}
            onClick={() => navigate('/services/create')}
          >
            Create Service
          </Button>
        )}
      </Box> */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 20,
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.length ? (
            filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={(id) => navigate(`/services/${id}`)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ gridColumn: '1 / -1' }}
            >
              <Paper
                variant="outlined"
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  borderStyle: 'dashed',
                }}
              >
                <SearchOffOutlined sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  No services match &quot;{search}&quot;
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                  Try a different search term
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  )
}
