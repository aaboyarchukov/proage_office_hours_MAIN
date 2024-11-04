import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="ru">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script strategy='beforeInteractive' src="https://telegram.org/js/telegram-web-app.js" />
      </body>
    </Html>
  )
}
