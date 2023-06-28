import { Navbar } from '@/components/deslocamento/navbar'
import { VeiculosForm } from '@/components/driver/veiculosForm'
import { Typography, Box } from '@mui/material'
import { useState } from 'react'

const tabs = ['Veículos', 'Histórico']

export default function Driver() {
  const [value, setValue] = useState(0)

  return (
    <Box
      sx={{
        paddingTop: '76px',
        display: 'grid',
        placeItems: 'center',
        width: '100%',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 500 }}>
        bem vindo,{' '}
        {/* <span style={{ color: '#7253b6', fontWeight: 700 }}>{user.nome}</span> */}
      </Typography>
      <Navbar tabs={tabs} value={value} setValue={setValue} />
      <VeiculosForm value={value} />
      {/* <Historic value={value} deslocamentos={deslocamentos} /> */}
    </Box>
  )
}
