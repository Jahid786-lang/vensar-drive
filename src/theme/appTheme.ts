import { createTheme } from '@mui/material/styles'
import {
  primaryVariants,
  secondaryVariants,
  errorVariants,
  warningVariants,
  infoVariants,
  successVariants,
  greyVariants,
} from './paletteVariants'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: primaryVariants,
    secondary: secondaryVariants,
    error: errorVariants,
    warning: warningVariants,
    info: infoVariants,
    success: successVariants,
    grey: greyVariants,
    background: {
      default: '#E0F2F1',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 150, 136, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", system-ui, sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            borderRadius: 2,
            '&::before': { borderBottom: 'none' },
            '&::after': { borderBottom: 'none' },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
  },
})
