import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { ICities } from '@/utils/types'

export function useCities(state: string) {
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.trim()}/distritos?orderBy=nome`

  const cities = useSWR<ICities[]>(url, fetcher)

  return cities
}
