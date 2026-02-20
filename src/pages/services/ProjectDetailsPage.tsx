import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getProjectsByServiceId } from '@/data/serviceProjects'
import { getProjectDetails, type ProjectDetailsData } from '@/data/projectDetails'
import { FileExplorer } from '@/components/documnets/FileExplorer'

const TAB_LABELS = [
  'Project Details',
  // 'Execution Summary',
  // 'Erection & Commissioning',
  // 'SCADA Monitoring',
  'Documents',
]

export function ProjectDetailsPage() {
  const { serviceId, projectId } = useParams<{ serviceId: string; projectId: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const projects = serviceId ? getProjectsByServiceId(serviceId) : []
  const project = projectId ? projects.find((p) => p.id === projectId) : null
  const details: ProjectDetailsData | null =
    serviceId && projectId && project
      ? getProjectDetails(serviceId, projectId, project.name, project.stateCode)
      : null

  if (!serviceId || !projectId) {
    navigate('/services', { replace: true })
    return null
  }
  if (!details) {
    navigate(`/services/${serviceId}`, { replace: true })
    return null
  }

  const highlightSx = {
    fontWeight: 600,
    color: 'primary.dark',
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 1200,
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
            // borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              pt: 2,
              pb: 1.5,
              bgcolor: 'primary.alpha6',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component="button"
              onClick={() => navigate(`/services/${serviceId}`)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1.5,
                border: 0,
                background: 'none',
                cursor: 'pointer',
                color: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': { color: 'primary.dark', textDecoration: 'underline' },
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
              Back to Projects
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                wordBreak: 'break-word',
              }}
            >
              {details.name}
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: { xs: 0, sm: 2 },
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                px: { xs: 1, sm: 2 },
              },
              '& .Mui-selected': { color: 'primary.main' },
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <Tab key={label} label={label} id={`tab-${i}`} />
            ))}
          </Tabs>

          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {tab === 0 && (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Client
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {details.client}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Contractor
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {details.contractor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Work Order No
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {details.workOrderNo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Date
                    </Typography>
                    <Typography variant="body1" sx={highlightSx}>
                      {details.date}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Contract Value
                    </Typography>
                    <Typography variant="body1" sx={highlightSx}>
                      ₹ {details.contractValue}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Total CCA
                    </Typography>
                    <Typography variant="body1" sx={highlightSx}>
                      {details.totalCca}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    // display: 'grid',
                    // gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    // gap: 2,
                    mb: 3,
                  }}
                >
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Work Scope
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {details.workScope}
                    </Typography>
                  </Paper>
                  {/* <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Payment Terms
                    </Typography>
                    {details.paymentTerms.length > 0 ? (
                      <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
                        {details.paymentTerms.map((term, i) => (
                          <Typography key={i} component="li" variant="body2" color="text.secondary">
                            {term}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </Paper> */}
                </Box>

                {details.majorComponents.length > 0 && (
                  <>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      Major Components
                    </Typography>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2, overflowX: 'auto', maxWidth: '100%' }}
                    >
                      <Table size="small" sx={{ minWidth: 280 }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Sr No</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Component</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Qty
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {details.majorComponents.map((row, i) => (
                            <TableRow
                              key={row.srNo}
                              sx={{
                                bgcolor: i % 2 === 0 ? 'background.paper' : 'action.hover',
                              }}
                            >
                              <TableCell>{row.srNo}</TableCell>
                              <TableCell>{row.component}</TableCell>
                              <TableCell align="right">{row.qty}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </>
            )}
            {tab === 1 && (
              <FileExplorer
                key={`${serviceId}-${projectId}`}
                projectPath={`/${serviceId}/${projectId}`}
                serviceId={serviceId}
              />
            )}
            {tab > 1 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {TAB_LABELS[tab]} — Coming soon
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

      </Box>
    </DashboardLayout>
  )
}
