import { useEffect } from 'react'
import { useTheme } from '@mui/material/styles'

/**
 * Injects theme palette into CSS variables so plain CSS can use var(--primary-main) etc.
 * Theme change karne par pure project me color update ho jayega.
 */
export function ThemeCssVars() {
  const theme = useTheme()
  const { palette } = theme

  useEffect(() => {
    const root = document.documentElement

    const setPaletteVars = (key: string, obj: Record<string, string> | undefined) => {
      if (!obj) return
      Object.entries(obj).forEach(([k, v]) => {
        if (typeof v === 'string') root.style.setProperty(`--${key}-${k}`, v)
      })
    }

    setPaletteVars('primary', palette.primary as Record<string, string>)
    setPaletteVars('secondary', palette.secondary as Record<string, string>)
    setPaletteVars('error', palette.error as Record<string, string>)
    setPaletteVars('warning', palette.warning as Record<string, string>)
    setPaletteVars('info', palette.info as Record<string, string>)
    setPaletteVars('success', palette.success as Record<string, string>)
    setPaletteVars('grey', palette.grey as Record<string, string>)

    if (palette.background) {
      root.style.setProperty('--background-default', palette.background.default)
      root.style.setProperty('--background-paper', palette.background.paper)
    }
    if (palette.text) {
      root.style.setProperty('--text-primary', palette.text.primary)
      root.style.setProperty('--text-secondary', palette.text.secondary)
      root.style.setProperty('--text-disabled', palette.text.disabled)
    }
    if (palette.divider) root.style.setProperty('--divider', palette.divider)
    if (palette.action) {
      root.style.setProperty('--action-hover', palette.action.hover)
      root.style.setProperty('--action-selected', palette.action.selected)
    }

    // Convenience aliases for CSS (plain CSS files use these)
    const primary = palette.primary as Record<string, string>
    if (primary?.main) {
      root.style.setProperty('--app-bg', palette.background?.default ?? primary[50] ?? '')
      root.style.setProperty('--accent', primary.main)
      root.style.setProperty('--accent-dark', primary.dark ?? primary[700])
      root.style.setProperty('--accent-soft', hexToRgba(primary.main, 0.25))
    }
  }, [palette])

  return null
}

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return hex
  const r = parseInt(m[1], 16)
  const g = parseInt(m[2], 16)
  const b = parseInt(m[3], 16)
  return `rgba(${r},${g},${b},${alpha})`
}
