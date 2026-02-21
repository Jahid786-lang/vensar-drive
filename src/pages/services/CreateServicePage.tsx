import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useCreateService } from '@/hooks/useServices'
import { useToast } from '@/contexts/ToastContext'
import { iconOptions } from '@/data/servicesData'

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CreateServicePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createService = useCreateService()
  const [serviceName, setServiceName] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [serviceIcon, setServiceIcon] = useState<string>('')
  const [description, setDescription] = useState('')

  const handleServiceNameChange = (value: string) => {
    setServiceName(value)
    if (!serviceId || serviceId === slugify(serviceName)) {
      setServiceId(slugify(value) || '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = serviceId.trim() || slugify(serviceName)
    if (!id) {
      showToast('Service ID is required', 'error')
      return
    }
    if (!serviceName.trim()) {
      showToast('Service name is required', 'error')
      return
    }
    try {
      await createService.mutateAsync({
        serviceId: id,
        serviceName: serviceName.trim(),
        serviceIcon: serviceIcon || null,
        description: description.trim() || null,
      })
      showToast('Service created', 'success')
      navigate(`/services/${id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create service', 'error')
    }
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        <Box
          component="button"
          onClick={() => navigate('/')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
            border: 0,
            background: 'none',
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowBack fontSize="small" />
          <Typography variant="body2">Back</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <AddCircleOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700}>
            Create Service
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Service Name"
              value={serviceName}
              onChange={(e) => handleServiceNameChange(e.target.value)}
              placeholder="e.g. Irrigation"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Service ID"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              placeholder="e.g. irrigation (lowercase, hyphens)"
              helperText="Used in URLs. Lowercase letters, numbers, hyphens only."
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="service-icon-label">Icon (optional)</InputLabel>
              <Select
                labelId="service-icon-label"
                label="Icon (optional)"
                value={serviceIcon}
                onChange={(e) => setServiceIcon(e.target.value)}
              >
                <MenuItem value="">None (use default)</MenuItem>
                {iconOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createService.isPending}
              >
                {createService.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </DashboardLayout>
  )
}
