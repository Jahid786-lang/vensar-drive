import { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import type { Theme } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'

const inputSx = (theme: Theme) => {
  const primary = theme.palette.primary as unknown as Record<string, string>
  return {
    '& .MuiFilledInput-root': {
      borderRadius: 2,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${primary.alpha20 ?? 'rgba(0,150,136,0.2)'}`,
      },
      '&::before, &::after': { display: 'none' },
    },
  }
}

export interface AppInputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  /** When true, shows password visibility toggle (use with type="password"). */
  showPasswordToggle?: boolean
}

export function AppInput({
  showPasswordToggle = false,
  type,
  slotProps,
  sx,
  ...rest
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const effectiveType =
    isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type

  const passwordAdornment =
    isPassword && showPasswordToggle ? (
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((p) => !p)}
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ) : null

  const inputSlot = slotProps?.input
  const existingEndAdornment =
    typeof inputSlot === 'object' && inputSlot !== null && 'endAdornment' in inputSlot
      ? (inputSlot as { endAdornment?: React.ReactNode }).endAdornment
      : undefined
  const endAdornment = passwordAdornment ?? existingEndAdornment

  return (
    <TextField
      label="With normal TextField"
      id="outlined-start-adornment"
      fullWidth
      type={effectiveType}
      slotProps={{
        ...slotProps,
        input: {
          ...(typeof inputSlot === 'object' && inputSlot !== null ? inputSlot : {}),
          endAdornment,
        },
      }}
      sx={[inputSx, sx].filter(Boolean) as never}
      {...rest}
    />
  )
}
