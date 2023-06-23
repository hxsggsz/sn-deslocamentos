import Image from 'next/image'
import { Box } from '@mui/material'
import { Sun, Moon } from '@phosphor-icons/react'
import { useThemes } from '@/context/themeContext'
import Link from 'next/link'

export const Header = () => {
  const theme = useThemes()
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        borderBottom: 1,
        borderColor: 'divider',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <Link href="https://secretarianaty.com/" target="_blank">
        <Image src="/logo.png" width={40} height={40} alt="logo do projeto" />
      </Link>

      <div style={{ cursor: 'pointer' }} onClick={theme.toggleTheme}>
        {theme.mode === 'light' ? (
          <Moon size={30} weight="bold" />
        ) : (
          <Sun size={30} weight="bold" />
        )}
      </div>
    </Box>
  )
}
