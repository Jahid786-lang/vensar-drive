import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ArrowBack from '@mui/icons-material/ArrowBack'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useService } from '@/hooks/useServices'
import { useCreateProject } from '@/hooks/useProjects'
import { useStates } from '@/hooks/useStates'
import { useToast } from '@/contexts/ToastContext'
import type { MajorComponent, CustomField } from '@/api/projectsApi'

const DEFAULT_CUSTOM_FIELDS: { label: string; value: string }[] = [
  { label: 'Client', value: '' },
  { label: 'Work Order No', value: '' },
  { label: 'Total Flow Rate', value: '' },
  { label: 'Contractor', value: '' },
  { label: 'Date', value: '' },
  { label: 'Total CCA', value: '' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function CreateProjectPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: service } = useService(serviceId)
  const { data: states = [] } = useStates()
  const createProject = useCreateProject(serviceId)

  const [projectId, setProjectId] = useState('')
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [title, setTitle] = useState('')
  const [workScope, setWorkScope] = useState('')
  const [majorComponents, setMajorComponents] = useState<MajorComponent[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>(
    DEFAULT_CUSTOM_FIELDS.map((f) => ({ ...f })),
  )

  const handleNameChange = (v: string) => {
    setName(v)
    setProjectId((prev) => {
      if (!prev || prev === slugify(name)) return slugify(v)
      return prev
    })
  }

  const addMajorComponent = () => {
    const nextSr = majorComponents.length
      ? Math.max(...majorComponents.map((m) => m.srNo)) + 1
      : 1
    setMajorComponents([
      ...majorComponents,
      { srNo: nextSr, component: '', qty: 0 },
    ])
  }

  const updateMajorComponent = (idx: number, field: keyof MajorComponent, val: string | number) => {
    const next = [...majorComponents]
    const numVal = field === 'qty' || field === 'srNo' ? Number(val) || 0 : 0
    if (field === 'srNo') next[idx] = { ...next[idx], srNo: numVal }
    else if (field === 'component') next[idx] = { ...next[idx], component: String(val) }
    else if (field === 'qty') next[idx] = { ...next[idx], qty: numVal }
    setMajorComponents(next)
  }

  const removeMajorComponent = (idx: number) => {
    setMajorComponents(majorComponents.filter((_, i) => i !== idx))
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '' }])
  }

  const updateCustomField = (idx: number, field: 'label' | 'value', val: string) => {
    const next = [...customFields]
    next[idx] = { ...next[idx], [field]: val }
    setCustomFields(next)
  }

  const removeCustomField = (idx: number) => {
    setCustomFields(customFields.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceId || !name.trim() || !projectId.trim() || !stateCode.trim()) {
      showToast('Name, Project ID and State are required', 'error')
      return
    }
    try {
      const payload = {
        projectId: projectId.trim().toLowerCase(),
        name: name.trim(),
        shortName: shortName.trim() || null,
        stateCode: stateCode.trim(),
        title: title.trim() || null,
        workScope: workScope.trim() || null,
        majorComponents: majorComponents.filter((m) => m.component.trim()),
        customFields: customFields.filter((f) => f.label.trim()),
      }
      await createProject.mutateAsync(payload)
      showToast('Project created successfully', 'success')
      navigate(`/services/${serviceId}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create project', 'error')
    }
  }

  if (!serviceId) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box
          component="button"
          onClick={() => navigate(`/services/${serviceId}`)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
            border: 0,
            background: 'none',
            cursor: 'pointer',
            color: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <ArrowBack fontSize="small" />
          Back to projects
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <AddCircleOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Create Project
          </Typography>
          {service && (
            <Typography variant="body2" color="text.secondary">
              under {service.serviceName}
            </Typography>
          )}
        </Box>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Project Name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                fullWidth
                placeholder="e.g. KAYAMPUR SITAMAU PRESSURIZED MICRO LIFT MAJOR IRRIGATION PROJECT"
              />
              <TextField
                label="Project ID (slug)"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                fullWidth
                placeholder="e.g. kayampur-sitamau"
                helperText="Lowercase, hyphens only. Used in URLs."
              />
              <TextField
                label="Short Name (optional)"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                fullWidth
                placeholder="e.g. Kayampur Sitamau PILMI"
              />
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  label="State"
                >
                  <MenuItem value="">Select state</MenuItem>
                  {states.map((s) => (
                    <MenuItem key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                placeholder="e.g. Kayampur Sitamau PILMI – Project Summary"
              />
              <TextField
                label="Work Scope"
                value={workScope}
                onChange={(e) => setWorkScope(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Design, supply, erection..."
              />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Custom Fields (Client, Contractor, etc.)
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddCircleOutlined />}
                    onClick={addCustomField}
                  >
                    Add field
                  </Button>
                </Box>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell width={48} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customFields.map((f, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={f.label}
                              onChange={(e) => updateCustomField(i, 'label', e.target.value)}
                              placeholder="e.g. Client"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={f.value}
                              onChange={(e) => updateCustomField(i, 'value', e.target.value)}
                              placeholder="Value"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => removeCustomField(i)}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Major Components
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddCircleOutlined />}
                    onClick={addMajorComponent}
                  >
                    Add component
                  </Button>
                </Box>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={80}>Sr No</TableCell>
                        <TableCell>Component</TableCell>
                        <TableCell width={100}>Qty</TableCell>
                        <TableCell width={48} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {majorComponents.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={m.srNo}
                              onChange={(e) =>
                                updateMajorComponent(i, 'srNo', e.target.value)
                              }
                              inputProps={{ min: 0 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={m.component}
                              onChange={(e) =>
                                updateMajorComponent(i, 'component', e.target.value)
                              }
                              placeholder="Component name"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={m.qty}
                              onChange={(e) =>
                                updateMajorComponent(i, 'qty', e.target.value)
                              }
                              inputProps={{ min: 0 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => removeMajorComponent(i)}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
                <Button variant="outlined" onClick={() => navigate(`/services/${serviceId}`)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createProject.isPending}
                >
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  )
}
