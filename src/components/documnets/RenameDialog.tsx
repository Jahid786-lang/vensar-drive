import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export interface RenameDialogProps {
  open: boolean
  name: string
  onClose: () => void
  onSubmit: (newName: string) => void | Promise<void>
  loading?: boolean
}

export function RenameDialog({
  open,
  name,
  onClose,
  onSubmit,
  loading = false,
}: RenameDialogProps) {
  const [value, setValue] = useState(name)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setValue(name)
      setError('')
    }
  }, [open, name])

  const handleClose = () => {
    setValue(name)
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Name is required')
      return
    }
    if (/[\/\\:*?"<>|]/.test(trimmed)) {
      setError('Name cannot contain / \\ : * ? " < > |')
      return
    }
    if (trimmed === name) {
      handleClose()
      return
    }
    setError('')
    try {
      await onSubmit(trimmed)
      handleClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to rename')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Name"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
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
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
