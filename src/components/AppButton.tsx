import { motion } from 'framer-motion'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { Theme } from '@mui/material/styles'
import type { ButtonProps } from '@mui/material/Button'

const primarySx = (theme: Theme) => {
  const primary = theme.palette.primary as unknown as Record<string, string>
  const shadow = primary.main ? `0 4px 14px ${primary.main}59` : undefined
  const shadowHover = primary.main ? `0 6px 20px ${primary.main}66` : undefined
  return {
    py: 1.5,
    borderRadius: 2,
    ...(shadow && { boxShadow: shadow }),
    '&:hover': {
      ...(shadowHover && { boxShadow: shadowHover }),
    },
  }
}

export interface AppButtonProps extends ButtonProps {
  /** Shows spinner and disables button when true. */
  loading?: boolean
  /** Enable Framer Motion hover/tap scale (default true for primary contained). */
  withMotion?: boolean
}

export function AppButton({
  loading = false,
  withMotion = true,
  children,
  disabled,
  sx,
  ...rest
}: AppButtonProps) {
  const isPrimary =
    rest.variant === 'contained' && (rest.color === 'primary' || rest.color === undefined)
  const effectiveDisabled = disabled ?? loading

  const commonProps = {
    disabled: effectiveDisabled,
    'aria-busy': loading,
    sx: isPrimary ? [primarySx, sx].filter(Boolean) as never : sx,
    ...rest,
    children: loading ? (
      <CircularProgress size={24} sx={{ color: 'white' }} />
    ) : (
      children
    ),
  }

  if (withMotion && isPrimary) {
    return (
      <Button
        component={motion.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...commonProps}
      />
    )
  }

  return <Button {...commonProps} />
}
