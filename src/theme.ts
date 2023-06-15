import { createTheme } from '@mui/material/styles'
import { Inter } from 'next/font/google'
import { red } from '@mui/material/colors'

export const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#5c4ae3',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
})

export default theme
