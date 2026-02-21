/**
 * NavSubTree – selected sidebar item ke neeche clean animated sub-path dikhata hai.
 */
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { motion, AnimatePresence } from 'framer-motion'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import { useService } from '@/hooks/useServices'
import { useProject } from '@/hooks/useProjects'
import { useNavigation } from '@/contexts/NavigationContext'

/* ─────────────────────────────────── */
/* Single row in the sub-tree          */
/* ─────────────────────────────────── */
function SubRow({
  label,
  icon,
  active,
  depth,
  onClick,
  delay,
}: {
  label: string
  icon?: React.ReactNode
  active: boolean
  depth: number
  onClick?: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, delay: delay ?? 0 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: `${10 + depth * 10}px`,
          pr: 0.5,
          py: '2px',
          position: 'relative',
          /* vertical guide line from parent */
          '&::before': {
            content: '""',
            position: 'absolute',
            left: `${4 + depth * 10}px`,
            top: 0,
            bottom: 0,
            width: '1px',
            bgcolor: 'divider',
          },
        }}
      >
        {/* horizontal tick */}
        <Box
          sx={{
            position: 'absolute',
            left: `${4 + depth * 10}px`,
            top: '50%',
            width: '6px',
            height: '1px',
            bgcolor: 'divider',
          }}
        />

        <Box
          component={onClick ? 'button' : 'div'}
          onClick={onClick}
          title={label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flex: 1,
            minWidth: 0,
            px: '6px',
            py: '3px',
            borderRadius: '6px',
            border: 'none',
            cursor: onClick ? 'pointer' : 'default',
            background: active
              ? 'linear-gradient(90deg,rgba(25,135,84,0.12) 0%,rgba(25,135,84,0.05) 100%)'
              : 'none',
            borderLeft: active ? '2px solid' : '2px solid transparent',
            borderColor: active ? 'primary.main' : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': onClick
              ? { bgcolor: 'action.hover' }
              : undefined,
          }}
        >
          <Box
            sx={{
              color: active ? 'primary.main' : 'text.disabled',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              fontSize: 13,
            }}
          >
            {icon}
          </Box>
          <Typography
            noWrap
            sx={{
              fontSize: '0.72rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'primary.dark' : 'text.secondary',
              lineHeight: 1.4,
              flex: 1,
              minWidth: 0,
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  )
}

/* ─────────────────────────────────── */
/* Services sub-tree                   */
/* ─────────────────────────────────── */
function ServicesSubTree() {
  const navigate = useNavigate()
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)

  const serviceId = parts[0] === 'services' ? parts[1] : undefined
  const projectId = parts[2] === 'projects' ? parts[3] : undefined

  const { data: service } = useService(serviceId)
  const { data: project } = useProject(serviceId, projectId)

  if (!serviceId) return null

  const serviceName = service?.serviceName ?? serviceId
  const projectName = project?.shortName ?? project?.name ?? projectId
  const isOnService = !projectId

  return (
    <Box sx={{ mt: 0.25, mb: 0.5 }}>
      <AnimatePresence>
        <SubRow
          key="service"
          label={serviceName}
          icon={<GridViewOutlined sx={{ fontSize: 13 }} />}
          active={isOnService}
          depth={0}
          delay={0}
          onClick={
            !isOnService
              ? () => navigate(`/services/${serviceId}`)
              : undefined
          }
        />

        {projectId && (
          <SubRow
            key="project"
            label={projectName ?? projectId}
            icon={<FolderOutlined sx={{ fontSize: 13 }} />}
            active={true}
            depth={1}
            delay={0.06}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}

/* ─────────────────────────────────── */
/* My Documents sub-tree               */
/* ─────────────────────────────────── */
function DocumentsSubTree() {
  const navigate = useNavigate()
  const { docFolderPath } = useNavigation()

  if (!docFolderPath.length) return null

  return (
    <Box sx={{ mt: 0.25, mb: 0.5 }}>
      <AnimatePresence>
        {docFolderPath.map((folder, idx) => (
          <SubRow
            key={folder.id}
            label={folder.name}
            icon={<FolderOutlined sx={{ fontSize: 13 }} />}
            active={idx === docFolderPath.length - 1}
            depth={idx}
            delay={idx * 0.05}
            onClick={
              idx < docFolderPath.length - 1
                ? () => navigate('/documents')
                : undefined
            }
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}

/* ─────────────────────────────────── */
/* Public export                        */
/* ─────────────────────────────────── */
export function NavSubTree({ itemId }: { itemId: string }) {
  const location = useLocation()
  const pathname = location.pathname

  if (itemId === 'services') {
    const isInService =
      pathname.startsWith('/services/') &&
      !pathname.startsWith('/services/create')
    if (!isInService) return null
    return <ServicesSubTree />
  }

  if (itemId === 'my-documents') {
    if (pathname !== '/documents') return null
    return <DocumentsSubTree />
  }

  return null
}
