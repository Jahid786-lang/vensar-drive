import type {
  PaletteColorOptions,
  SimplePaletteColorOptions,
  TypeBackground,
  TypeText,
} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteColor {
    50?: string
    100?: string
    200?: string
    300?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    alpha4?: string
    alpha6?: string
    alpha8?: string
    alpha12?: string
    alpha18?: string
    alpha20?: string
    alpha25?: string
  }

  interface SimplePaletteColorOptions {
    50?: string
    100?: string
    200?: string
    300?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    alpha4?: string
    alpha6?: string
    alpha8?: string
    alpha12?: string
    alpha18?: string
    alpha20?: string
    alpha25?: string
  }

  interface Palette {
    grey: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>
  }

  interface PaletteOptions {
    grey?: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>
  }
}
