import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import ArrowBack from '@mui/icons-material/ArrowBack'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import ArrowForward from '@mui/icons-material/ArrowForward'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useService } from '@/hooks/useServices'
import { isAdminOrAbove } from '@/constants/roles'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useProjects, useSeedIrrigationProject } from '@/hooks/useProjects'
import { useStates } from '@/hooks/useStates'
import type { ProjectItem } from '@/api/projectsApi'

function getProjectDisplayName(p: ProjectItem): string {
  return p.shortName ?? p.name
}

const glassPanel = {
  bgcolor: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.6)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
}

const glassCardBase = {
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.85)',
  boxShadow:
    '0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
}

function ProjectCard({
  project,
  index,
  onClick,
  isDefault,
}: {
  project: ProjectItem
  index: number
  onClick: () => void
  isDefault?: boolean
}) {
  const displayName = getProjectDisplayName(project)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{ height: '100%' }}
    >
      <Paper
        component="button"
        type="button"
        variant="outlined"
        onClick={onClick}
        sx={{
          width: '100%',
          minHeight: 20,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'rgba(255, 255, 255, 0.55)',
          ...glassCardBase,
          borderLeft: '4px solid',
          borderLeftColor: isDefault ? 'primary.main' : 'primary.light',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            bgcolor: 'rgba(255, 255, 255, 0.78)',
            borderColor: 'rgba(19, 112, 39, 0.95)',
            boxShadow: (t) => {
              const c = (t.palette.primary as unknown as Record<string, string>).alpha18 ?? 'rgba(0,150,136,0.18)'
              return `0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.9), 0 12px 28px ${c}`
            },
            '& .project-arrow': { opacity: 1 },
            '& .project-icon-wrap': {
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,150,136,0.35)',
            },
          },
          '&:active': { transform: 'translateY(-2px)' },
        }}
      >
        <Box
          className="project-icon-wrap"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: 'primary.alpha12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            flexShrink: 0,
            transition: 'all 0.3s ease',
          }}
        >
          <FolderOutlined sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              lineHeight: 1.4,
              fontSize: '0.9375rem',
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {displayName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip
              label={project.stateCode}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiChip-label': { px: 1 },
              }}
            />
            {/* {isDefault && (
              <Chip
                label="Default"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                  bgcolor: 'primary.alpha20',
                  color: 'primary.dark',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )} */}
          </Box>
        </Box>
        <Box
          className="project-arrow"
          sx={{
            opacity: 0,
            transition: 'opacity 0.25s ease',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          <ArrowForward sx={{ fontSize: 22 }} />
        </Box>
      </Paper>
    </motion.div>
  )
}

export function ServiceProjectsPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('')
  const showCreateProject = isAdminOrAbove(user?.role)

  const { data: service, isLoading: serviceLoading, error: serviceError } = useService(serviceId)
  const { data: allProjects = [], isLoading: projectsLoading } = useProjects(serviceId)
  const { data: statesList = [] } = useStates()
  const seedIrrigation = useSeedIrrigationProject()

  const states = useMemo(
    () => [...statesList].sort((a, b) => a.name.localeCompare(b.name)),
    [statesList],
  )

  const filteredProjects = useMemo(() => {
    let list = allProjects
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.shortName && p.shortName.toLowerCase().includes(q))
      )
    }
    if (stateFilter) {
      list = list.filter((p) => p.stateCode === stateFilter)
    }
    return list
  }, [allProjects, search, stateFilter])

  const isLoading = serviceLoading || projectsLoading

  const defaultProjectId =
    serviceId === 'irrigation' && allProjects.some((p) => p.projectId === 'kayampur-sitamau')
      ? 'kayampur-sitamau'
      : null

  if (!serviceId) {
    navigate('/', { replace: true })
    return null
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      </DashboardLayout>
    )
  }

  if (serviceError || !service) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error" sx={{ mb: 2 }}>
            {serviceError instanceof Error ? serviceError.message : 'Service not found'}
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Services
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          minHeight: '100%',
          // background: (t) =>
          //   `linear-gradient(160deg, ${(t.palette.primary as unknown as Record<string, string>).alpha6 ?? 'rgba(0,150,136,0.06)'} 0%, ${(t.palette.primary as unknown as Record<string, string>).alpha12 ?? 'rgba(0,150,136,0.12)'} 50%, transparent 100%)`,
          // py: { xs: 2, sm: 3 },
          // px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              borderRadius: 2,
              ...glassPanel,
            }}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                pt: { xs: 2, sm: 2.5 },
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.7)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
              }}
            >
              <Box
                component="button"
                onClick={() => navigate('/')}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                  py: 0.5,
                  px: 0,
                  border: 0,
                  background: 'none',
                  cursor: 'pointer',
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.dark', textDecoration: 'underline' },
                  '&:active': { opacity: 0.8 },
                }}
              >
                <ArrowBack sx={{ fontSize: 20 }} />
                Back to Services
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ '&:hover': { color: 'primary.main' }, cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                >
                  Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  /
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary.dark">
                  {service?.serviceName ?? serviceId}
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'primary.dark',
                  mt: 1,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Projects ({allProjects.length})
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 4 } }}>
              {serviceId === 'irrigation' &&
                showCreateProject &&
                allProjects.length === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        try {
                          const res = await seedIrrigation.mutateAsync()
                          showToast(
                            res.seeded > 0
                              ? 'Sample project (Kayampur Sitamau) seeded'
                              : 'Sample project already exists',
                            res.seeded > 0 ? 'success' : 'info',
                          )
                        } catch (err) {
                          showToast(
                            err instanceof Error ? err.message : 'Seed failed',
                            'error',
                          )
                        }
                      }}
                      disabled={seedIrrigation.isPending}
                    >
                      {seedIrrigation.isPending ? 'Seeding...' : 'Seed sample project'}
                    </Button>
                  </Box>
                )}
              {allProjects.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    alignItems: 'stretch',
                  }}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Search by project name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlined fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      minWidth: 0,
                      flex: { xs: '1 1 100%', sm: '0 0 auto' },
                      width: { xs: '100%', sm: 260 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(8px)',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.light',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 0,
                      width: { xs: '100%', sm: 180 },
                      '& .MuiInputBase-root': { minHeight: 40 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(8px)',
                      },
                    }}
                  >
                    <InputLabel id="filter-state-label">Filter by state</InputLabel>
                    <Select
                      labelId="filter-state-label"
                      label="Filter by state"
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                    >
                      <MenuItem value="">All states</MenuItem>
                      {states.map((st) => (
                        <MenuItem key={st.code} value={st.code}>
                          {st.name} ({st.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {(search || stateFilter) && (
                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                      Showing {filteredProjects.length} of {allProjects.length}
                    </Typography>
                  )}
                  {showCreateProject && serviceId && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddCircleOutlined />}
                      onClick={() => navigate(`/services/${serviceId}/projects/create`)}
                      sx={{ alignSelf: 'center', ml: 'auto' }}
                    >
                      Create Project
                    </Button>
                  )}
                </Box>
              )}

              {filteredProjects.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 2,
                    borderRadius: 3,
                    borderStyle: 'dashed',
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    ...glassCardBase,
                  }}
                >
                  <FolderOutlined sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {allProjects.length === 0
                      ? 'No projects for this service yet.'
                      : 'No projects match your search or filter.'}
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
                    gap: 2,
                  }}
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.projectId}
                      project={project}
                      index={index}
                      isDefault={project.projectId === defaultProjectId}
                      onClick={() => navigate(`/services/${serviceId}/projects/${project.projectId}`)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 280,
              flexShrink: 0,
              p: 2.5,
              borderRadius: 2,
              ...glassPanel,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
              <InfoOutlined sx={{ color: 'primary.main', fontSize: 22 }} />
              <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
                Info
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Projects under this service are listed here. Use search to find by name or filter by state. Click a project to view details.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>
  )
}
