import { Inter } from 'next/font/google'
import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import { createContext, useContext, ReactNode, useState, useMemo } from 'react'
import { setCookie, getCookie } from 'cookies-next'

export const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

interface IThemeContext {
  mode: 'dark' | 'light'
  toggleTheme: () => void
}
export const ThemeContext = createContext({} as IThemeContext)

export const useThemes = () => useContext(ThemeContext)

export const ThemeManagerProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const saveTheme = useMemo(() => {
    const themeCookie = getCookie('theme')
    if (!themeCookie) {
      return prefersDarkMode ? 'dark' : 'light'
    }

    return themeCookie ? 'dark' : 'light'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersDarkMode, setCookie])

  const [mode, setMode] = useState<'light' | 'dark'>(saveTheme)

  const colorMode = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
        setCookie('theme', mode === 'light')
      },
      mode,
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#dddee2',
          },
          error: {
            main: red.A400,
          },
        },
        typography: {
          fontFamily: inter.style.fontFamily,
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                label: {
                  color: 'rgba(0, 0, 0, 0.6)',
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                },
                input: {
                  color: '#000',
                },
                '& :focus': {
                  background: '#fff',
                },
                borderRadius: '4px',
                background: '#f5f3f3',
                width: '100%',
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
              root: {
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
                  color: '#434459',
                },
                '& .MuiTabs-indicator': {
                  color: '#434459',
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
