import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Talk to Samaksh - Your Personal AI Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Talk to Samaksh - AI Assistant</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}