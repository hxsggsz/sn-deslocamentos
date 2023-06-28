import { Inter } from 'next/font/google'
import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import { createContext, useContext, ReactNode, useState, useMemo } from 'react'

export const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

interface IThemeContext {
  mode: boolean
  toggleTheme: () => void
}
export const ThemeContext = createContext({} as IThemeContext)

export const useThemes = () => useContext(ThemeContext)

export const ThemeManagerProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeStorage, setThemeStorage] = useLocalStorage(
    'theme',
    prefersDarkMode,
  )

  const [mode, setMode] = useState(themeStorage)

  const colorMode = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prev) => !prev)
        setThemeStorage(!mode)
      },
      mode,
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode ? 'dark' : 'light',
          primary: {
            main: '#7253b6',
          },
          error: {
            main: red.A400,
          },
        },
        typography: {
          fontFamily: inter.style.fontFamily,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '12px 12px',
                ': hover': {
                  borderTop: '8px solid #7253b6',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                borderRadius: '4px',
                background: '#f5f3f3',
                width: '100%',
                label: {
                  color: 'rgba(0, 0, 0, 0.6)',
                  background: '#f5f3f3',
                  borderRadius: '4px',
                  padding: '2px 6px',
                },
                input: {
                  color: '#000',
                },
                '& :focus': {
                  background: '#fff',
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              icon: {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              select: {
                border: 'none',
                background: '#f5f3f3',
                color: 'rgba(0, 0, 0, 0.6)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              contained: {
                borderRadius: '6px',
                background: '#7253b6',
                color: '#fff',
                ':hover': {
                  background: '#d6d6d6',
                  color: '#7253b6',
                },
                ':disabled': {
                  color: '#fff',
                  background: '#1e0f3f',
                  opacity: 0.6,
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: 'rgba(0, 0, 0, 0.6)',
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              root: {
                label: {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
                button: {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
              },
              clearIndicator: {
                color: 'rgba(0, 0, 0, 0.6)',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                '& .mui-style-1o1mk71-MuiTabs-indicator': {
                  backgroundColor: '#7253b6',
                },
                '& .Mui-selected': {
                  color: '#373841',
                },
                '& .MuiTabs-indicator': {
                  color: '#373841',
                },
              },
            },
          },
        },
      }),
    [mode],
  )
  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
