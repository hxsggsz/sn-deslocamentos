import axios from 'axios'
import { IUF } from '@/utils/types'
import { GetStaticProps } from 'next/types'
import { SignUp } from '@/components/auth/client/signup'

export default function Signup({ states }: IUF) {
  return <SignUp states={states} />
}

// os UFs são os mesmos e nunca irão mudar e não dependem de outros inputs para serem renderizados, por isso estou passando ele via getStaticProps que irá rodar esse código durante a build do site
export const getStaticProps: GetStaticProps = async () => {
  let states
  try {
    const { data } = await axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    )
    states = data
  } catch (error) {
    console.log(error)
  }
  return { props: { states } }
}
