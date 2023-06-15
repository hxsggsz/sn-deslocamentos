import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document'
import * as React from 'react'
import { AppType } from 'next/app'
import { MyAppProps } from './_app'
import createEmotionCache from '../../src/createEmotionCache'
import createEmotionServer from '@emotion/server/create-instance'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: React.JSX.Element[]
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
  return (
    <Html lang="pt-BR">
      <Head>{emotionStyleTags}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>,
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(
    (await Document.getInitialProps(ctx)).html,
  )
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...(await Document.getInitialProps(ctx)),
    emotionStyleTags,
  }
}
