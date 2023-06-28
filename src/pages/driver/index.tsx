import { Navbar } from '@/components/navbar'
import { VehicleCard } from '@/components/driver/vehiclesCard'
import { VeiculosForm } from '@/components/driver/veiculosForm'
import { Typography, Box } from '@mui/material'
import { useState } from 'react'
import { GetServerSideProps } from 'next/types'
import { getCookie } from 'cookies-next'
import { api } from '@/utils/api'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '@/utils/fetcher'
import { Historic } from '@/components/historic'
import { IDeslocamentos, IVehicles } from '@/utils/types'

const tabs = ['Veículos', 'Histórico']

interface IDriver {
  userId: number
  fallback: IVehicles[]
  deslocamento: IDeslocamentos[]
}

export default function Driver({ userId, fallback, deslocamento }: IDriver) {
  const [value, setValue] = useState(0)
  const { data, mutate } = useSWR<IVehicles[]>(
    'https://api-deslocamento.herokuapp.com/api/v1/Veiculo',
    fetcher,
  )

  if (!data) {
    return []
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
        {/* <span style={{ color: '#7253b6', fontWeight: 700 }}>{user.nome}</span> */}
      </Typography>
      <Navbar tabs={tabs} value={value} setValue={setValue} />
      <VeiculosForm value={value} mutate={mutate} />
      <SWRConfig value={{ fallback }}>
        <VehicleCard value={value} vehicles={data} />
      </SWRConfig>
      <Historic value={value} deslocamentos={deslocamento} />
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie('token', { req, res })
  // let user
  // try {
  //   // os dados estão sendo constantemente apagados por isso o try catch no usuário, se não achar, o usuário é redirecionado
  //   const userResponse = await api.get(`/Cliente/${userId}`)
  //   user = userResponse.data
  // } catch (error) {
  //   console.error('[user]: ', error)
  //   deleteCookie('token', { req, res })
  // }
  const { data: vehicle } = await api.get('/Veiculo')
  const { data: deslocamento } = await api.get<IDeslocamentos[]>(
    '/Deslocamento',
  )

  const deslocamentoFilterDriver = deslocamento.filter(
    (des) => des.idCondutor === Number(userId),
  )

  return {
    props: {
      // user,
      userId: Number(userId),
      fallback: {
        'https://api-deslocamento.herokuapp.com/api/v1/Veiculo': vehicle,
      },
      deslocamento: deslocamentoFilterDriver,
    },
  }
}
