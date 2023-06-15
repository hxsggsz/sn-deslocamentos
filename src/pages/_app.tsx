import theme from '@/theme'
import Head from 'next/head'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import createEmotionCache from '@/createEmotionCache'
import { CacheProvider, EmotionCache } from '@emotion/react'

const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="description"
          content="secretária natyA Sua Central de Atendimento ao ClienteFornecemos uma visão abrangente de todas as interações de atendimento ao cliente, com boots e agentes humanos na mesma plataforma, estatísticas em tempo real ao toque de um botão. Iniciar Agora Nossa SoluçãoNão perca vendas por espera de atendimento, automatize! Time Vendas Um time comercial unido, coeso, separado"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}
