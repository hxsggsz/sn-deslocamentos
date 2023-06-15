import { TextField, Box } from '@mui/material'

export default function Home() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'palette.background.default',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <h1>Bem vindo ao SN Deslocamentos!</h1>
        <p>Primeiro de tudo, entre na sua conta:</p>
        <TextField id="outlined-basic" label="Seu Nome" variant="outlined" />
      </Box>
    </Box>
  )
}
