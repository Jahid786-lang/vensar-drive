import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from '@/store'
import { queryClient } from '@/lib/queryClient'
import { appTheme } from '@/theme/appTheme'
import { ThemeCssVars } from '@/theme/ThemeCssVars'
import { ToastProvider } from '@/contexts/ToastContext'
import { NavigationProvider } from '@/contexts/NavigationContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <ThemeCssVars />
          <CssBaseline />
          <ToastProvider>
            <NavigationProvider>
              <App />
            </NavigationProvider>
          </ToastProvider>
        </ThemeProvider>
        {/* {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-right" />} */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
