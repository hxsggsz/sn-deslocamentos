import axios from 'axios'
import { IUF } from '@/utils/types'
import { SignUp } from '@/components/signup'
import { GetStaticProps } from 'next/types'

export default function Signup({ states }: IUF) {
  return <SignUp states={states} />
}

// os UFs são os mesmos e nunca irão mudar e não dependem de outros inputs para serem renderizados, por isso estou passando ele via getStaticProps
export const getStaticProps: GetStaticProps<{ states: IUF }> = async () => {
  const statesResponse = await axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
  )
  const states = statesResponse.data
  return { props: { states } }
}
