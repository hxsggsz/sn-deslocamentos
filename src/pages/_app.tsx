import theme, { inter } from '@/theme'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import createEmotionCache from '@/createEmotionCache'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { ThemeManagerProvider } from '@/context/themeContext'
import { Header } from '@/components/header'

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
          content="secretária naty. A Sua Central de Atendimento ao ClienteFornecemos uma visão abrangente de todas as interações de atendimento ao cliente, com boots e agentes humanos na mesma plataforma, estatísticas em tempo real ao toque de um botão. Iniciar Agora Nossa Solução. Não perca vendas por espera de atendimento, automatize! Time Vendas. Um time comercial unido, coeso, separado"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <title>SN Deslocamentos</title>
      </Head>
      <ThemeProvider theme={theme}>
        <ThemeManagerProvider>
          <main className={inter.className}>
            <Header />
            <CssBaseline enableColorScheme />
            <Component {...pageProps} />
          </main>
        </ThemeManagerProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
