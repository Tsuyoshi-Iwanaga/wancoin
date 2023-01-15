import { styled } from '@mui/material'
import { Html, Head, Main, NextScript } from 'next/document'
import Header from '../src/components/header'

const Body = styled('body')({
  backgroundColor: '#f4ede6'
})

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,900&display=swap" rel="stylesheet" />
      </Head>
      <Body>
        <Header />
        <Main />
        <NextScript />
      </Body>
    </Html>
  )
}
