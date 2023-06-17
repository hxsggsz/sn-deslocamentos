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
                input: {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                border: 'none',
                borderRadius: '4px',
                background: '#434459',
                width: '100%',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              icon: {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              select: {
                border: 'none',
                background: '#434459',
                color: 'rgba(255, 255, 255, 0.7)',
                '.mui-style-z2z2zu-MuiFormLabel-root-MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '6px',
                '&.Mui-disabled': {
                  background: 'rgba(255, 255, 255, 0.4)',
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
