import { api } from '@/utils/api'
import useSWR, { SWRConfig } from 'swr'
import { deleteCookie, getCookie } from 'cookies-next'
import { fetcher } from '@/utils/fetcher'
import { Navbar } from '@/components/navbar'
import { Typography, Box } from '@mui/material'
import { GetServerSideProps } from 'next/types'
import { Historic } from '@/components/historic'
import { DriverModal } from '@/components/driver/modal'
import { IDeslocamentos, IVehicles } from '@/utils/types'
import { useState, Dispatch, SetStateAction, useMemo } from 'react'
import { VehicleCard } from '@/components/driver/vehiclesCard'
import { VeiculosForm } from '@/components/driver/veiculosForm'
import { useRouter } from 'next/navigation'
import { IDrivers } from '@/components/deslocamento/SelectDriver'

const tabs = ['Veículos', 'Histórico']

interface IDriver {
  user: IDrivers
  userId: number
  isClient: boolean
  fallback: IVehicles[]
  deslocamento: IDeslocamentos[]
}

export default function Driver({
  user,
  userId,
  isClient,
  fallback,
  deslocamento,
}: IDriver) {
  const router = useRouter()
  const [value, setValue] = useState(0)
  const [observation, setObservation] = useState('')
  const { data, mutate } = useSWR<IVehicles[]>(
    'https://api-deslocamento.herokuapp.com/api/v1/Veiculo',
    fetcher,
  )

  const { data: desloc, mutate: mutateDesloc } = useSWR<IDeslocamentos[]>(
    'https://api-deslocamento.herokuapp.com/api/v1/Deslocamento',
    fetcher,
    { refreshInterval: 1000 },
  )

  const isDelosc = useMemo(() => {
    const newDesloc = desloc?.find(
      (des) => des.idCondutor === userId && des.observacao === '',
    )

    return newDesloc
  }, [desloc, userId])

  if (!data) {
    return []
  }

  if (!userId) {
    router.push('/driver/login')
  }

  if (isClient) {
    router.push('/deslocamento')
  }

  async function handleFinsh(setIsOpen: Dispatch<SetStateAction<boolean>>) {
    const date = new Date()
    const kmFinal = Math.floor(Math.random() * 50 + 1)

    const body = {
      id: isDelosc!.id,
      kmFinal: isDelosc!.kmInicial + kmFinal,
      fimDeslocamento: date.toISOString(),
      observacao: observation,
    }
    await api.put<IDeslocamentos>(
      `/Deslocamento/${isDelosc!.id}/EncerrarDeslocamento`,
      body,
    )
    mutateDesloc()
    setIsOpen(false)
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
      <VeiculosForm value={value} mutate={mutate} />
      <SWRConfig value={{ fallback }}>
        <VehicleCard value={value} vehicles={data} />
      </SWRConfig>
      <Historic value={value} deslocamentos={deslocamento} />
      <DriverModal
        newDesloc={isDelosc}
        handleFinsh={handleFinsh}
        observation={observation}
        setObservation={setObservation}
      />
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie('token', { req, res })
  let user
  let isClient = false

  try {
    // os dados estão sendo constantemente apagados por isso o try catch no usuário, se não achar, o usuário é redirecionado
    const { data } = await api.get<IDrivers[]>(`/Condutor/${userId}`)
    user = data
  } catch (err) {
    const { data } = await api.get(`/Cliente/${userId}`)
    if (!data) {
      deleteCookie('token', { req, res })
    }
    isClient = true
    user = data
    console.log('[user]: ', err)
  }
  const { data: vehicle } = await api.get('/Veiculo')
  const { data: deslocamento } = await api.get<IDeslocamentos[]>(
    '/Deslocamento',
  )

  const deslocamentoFilterDriver = deslocamento.filter(
    (des) => des.idCondutor === Number(userId),
  )

  return {
    props: {
      user,
      isClient,
      userId: Number(userId),
      fallback: {
        'https://api-deslocamento.herokuapp.com/api/v1/Veiculo': vehicle,
      },
      deslocamento: deslocamentoFilterDriver,
    },
  }
}
