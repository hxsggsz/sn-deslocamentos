import { GetServerSideProps } from 'next/types'
import { Navbar } from '@/components/navbar'
import { deleteCookie, getCookie } from 'cookies-next'
import { api } from '@/utils/api'
import { IClient, IDeslocamentos, IVehicles } from '@/utils/types'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { DeslocamentoForm } from '@/components/deslocamento/deslocamentoForm'
import { useRouter } from 'next/router'
import { IDrivers } from '../components/deslocamento/SelectDriver'
import { Historic } from '@/components/deslocamento/historic'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '@/utils/fetcher'

interface IDeslocamento {
  user: IClient
  userId: number
  drivers: IDrivers[]
  vehicles: IVehicles[]
  fallback: IDeslocamentos[]
}

const tabs = ['Deslocamento', 'Histórico']

export default function Deslocamento({
  user,
  userId,
  drivers,
  vehicles,
  fallback,
}: IDeslocamento) {
  const router = useRouter()
  const [value, setValue] = useState(0)
  const { data, mutate } = useSWR<IDeslocamentos[]>(
    'https://api-deslocamento.herokuapp.com/api/v1/Deslocamento',
    fetcher,
  )

  if (!data) {
    return []
  }

  if (!userId) {
    router.push('/')
  }

  const deslocamentoFilter = data.filter(
    (des) => des.idCliente === Number(userId),
  )

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
        <Historic value={value} deslocamentos={deslocamentoFilter} />
      </SWRConfig>
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
  const [DriversResponse, VehiclesResponse, DeslocamentoResponse] =
    await Promise.all([
      api.get('/Condutor'),
      api.get('/Veiculo'),
      api.get<IDeslocamentos[]>('Deslocamento'),
    ])

  const allRuns = DeslocamentoResponse.data
  // todo: filtrar todas os deslocamentos com checklist diferente de "pendente"
  const deslocamentos = allRuns.filter(
    (runs) => runs.idCliente === Number(userId),
  )

  return {
    props: {
      user,
      userId,
      drivers: DriversResponse.data,
      vehicles: VehiclesResponse.data,
      fallback: {
        'https://api-deslocamento.herokuapp.com/api/v1/Deslocamento':
          deslocamentos,
      },
    },
  }
}
