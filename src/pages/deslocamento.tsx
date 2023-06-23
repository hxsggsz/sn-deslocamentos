import { GetServerSideProps } from 'next/types'
import { Navbar } from '@/components/deslocamento/navbar'
import { deleteCookie, getCookie } from 'cookies-next'
import { api } from '@/utils/api'
import { IClient, IVehicles } from '@/utils/types'
import { Box } from '@mui/material'
import { useState } from 'react'
import { DeslocamentoForm } from '@/components/deslocamento/deslocamentoForm'
import { useRouter } from 'next/router'
import { IDrivers } from '../components/deslocamento/SelectDriver'

interface IDeslocamento {
  user: IClient
  userId: number
  drivers: IDrivers[]
  vehicles: IVehicles[]
}

const tabs = ['Novo deslocamento', 'histórico de deslocamentos']

export default function Deslocamento({
  user,
  userId,
  drivers,
  vehicles,
}: IDeslocamento) {
  const router = useRouter()
  const [value, setValue] = useState(0)
  if (!userId) {
    router.push('/')
  }

  return (
    <Box
      sx={{
        paddingTop: '60px',
        display: 'grid',
        placeItems: 'center',
        width: '100%',
      }}
    >
      <h1>
        bem vindo,{' '}
        <span style={{ color: '#7253b6', fontWeight: 700 }}>{user.nome}</span>
      </h1>
      <Navbar tabs={tabs} value={value} setValue={setValue} />
      <DeslocamentoForm
        value={value}
        vehicles={vehicles}
        allDrivers={drivers}
      />
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie('token', { req, res })
  let user
  try {
    // os dados estão sendo constantemente apagados por isso o try catch no usuário, se não achar, o usuário é redirecionado
    const userResponse = await api.get(`/Cliente/${userId}`)
    user = userResponse.data
  } catch (error) {
    console.error('[user]: ', error)
    deleteCookie('token', { req, res })
  }

  const DriversResponse = await api.get('/Condutor')
  const drivers = DriversResponse.data

  const VehiclesResponse = await api.get('/Veiculo')
  const vehicles = VehiclesResponse.data

  return {
    props: {
      user,
      userId,
      drivers,
      vehicles,
    },
  }
}
