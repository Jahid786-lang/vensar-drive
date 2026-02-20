import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export interface CreateFolderDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void | Promise<void>
  loading?: boolean
}

export function CreateFolderDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
}: CreateFolderDialogProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleClose = () => {
    setName('')
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Folder name is required')
      return
    }
    if (/[\/\\:*?"<>|]/.test(trimmed)) {
      setError('Folder name cannot contain / \\ : * ? " < > |')
      return
    }
    setError('')
    try {
      await onSubmit(trimmed)
      handleClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create folder')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Folder name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          error={!!error}
          helperText={error}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
