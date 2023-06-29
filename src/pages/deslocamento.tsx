import { SWRConfig } from 'swr'
import { useState } from 'react'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { Navbar } from '@/components/navbar'
import { GetServerSideProps } from 'next/types'
import { Box, Typography } from '@mui/material'
import { Historic } from '@/components/historic'
import { deleteCookie, getCookie } from 'cookies-next'
import { useDeslocamento } from '@/hooks/useDeslocamento'
import { IDrivers } from '../components/deslocamento/SelectDriver'
import { IClient, IDeslocamentos, IVehicles } from '@/utils/types'
import { DeslocamentoForm } from '@/components/deslocamento/deslocamentoForm'

interface IDeslocamento {
  user: IClient
  userId: number
  isDriver: boolean
  drivers: IDrivers[]
  vehicles: IVehicles[]
  fallback: IDeslocamentos[]
}

const tabs = ['Deslocamento', 'Histórico']

export default function Deslocamento({
  user,
  userId,
  isDriver,
  drivers,
  vehicles,
  fallback,
}: IDeslocamento) {
  const router = useRouter()
  const [value, setValue] = useState(0)
  const { deslocamentoFilterClient, data, mutate } = useDeslocamento(userId)

  if (!data) {
    return []
  }

  if (!userId) {
    router.push('/')
  }

  if (isDriver) {
    router.push('/driver')
  }

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
        <span style={{ color: '#7253b6', fontWeight: 700 }}>{user.nome}</span>
      </Typography>
      <Navbar tabs={tabs} value={value} setValue={setValue} />
      <DeslocamentoForm
        value={value}
        userId={userId}
        mutate={mutate}
        vehicles={vehicles}
        allDrivers={drivers}
      />
      <SWRConfig value={{ fallback }}>
        <Historic value={value} deslocamentos={deslocamentoFilterClient!} />
      </SWRConfig>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie('token', { req, res })
  let user
  let isDriver = false
  try {
    // os dados estão sendo constantemente apagados por isso o try catch no usuário, se não achar, o usuário é redirecionado
    const { data } = await api.get(`/Cliente/${userId}`)
    user = data
  } catch (error) {
    console.error('[user]: ', error)
    const { data } = await api.get(`/Condutor/${userId}`)
    if (!data) {
      deleteCookie('token', { req, res })
    }
    isDriver = true
    user = data
  }
  const [DriversResponse, VehiclesResponse, DeslocamentoResponse] =
    await Promise.all([
      api.get('/Condutor'),
      api.get('/Veiculo'),
      api.get<IDeslocamentos[]>('Deslocamento'),
    ])

  const allRuns = DeslocamentoResponse.data
  const deslocamentos = allRuns.filter(
    (runs) => runs.idCliente === Number(userId),
  )

  return {
    props: {
      user,
      isDriver,
      userId: Number(userId),
      drivers: DriversResponse.data,
      vehicles: VehiclesResponse.data,
      fallback: {
        'https://api-deslocamento.herokuapp.com/api/v1/Deslocamento':
          deslocamentos,
      },
    },
  }
}
