import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { IDeslocamentos } from '@/utils/types'

export function useDeslocamento(id: number) {
  const { data, mutate } = useSWR<IDeslocamentos[]>(
    'https://api-deslocamento.herokuapp.com/api/v1/Deslocamento',
    fetcher,
  )

  const deslocamentoFilterClient = data?.filter(
    (des) => des.idCliente === id && des.checkList !== 'pendente',
  )

  return { deslocamentoFilterClient, data, mutate }
}
