import Head from 'next/head'
import { useRouter } from 'next/router'
import { Inter } from '@next/font/google'
import axiosClient from '../functions/fetch'
import { Box, Button, Container, Paper, TextField, styled, Backdrop, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { AxiosResponse } from 'axios'

const inter = Inter({ subsets: ['latin'] })

const ContentWrapper = styled(Paper)({
  backdropColor: '#fff',
  width: '100%',
  maxWidth: 800,
  minHeight: '70vh',
  padding: 20,
  margin: '0 auto',
})

const Title = styled('h1')({
  textAlign: 'center'
})

const FormWrapper = styled(Box)({
  marginTop: '60px',
  maxWidth: '500px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const FormItemWrapper = styled(Box)({
  marginBottom: 30,
  width: '100%',
  display: 'flex',
  alignItems: 'center'
})

const FormTextLabel = styled('span')({
  display: 'block',
  minWidth: '7em'
})

const FormItem = styled(TextField)({
  fontSize: 24
})

const ButtonWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 60,
})

const LoginButton = styled(Button)({
  backgroundColor: '#f08300',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: 8,
  fontSize: 24,
})

const SignUpModal = styled(Backdrop)({
  color: '#fff',
  zIndex: 2,
})

export default function Home() {

  const [status, setStatus] = useState('')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = () => {
    try {
      if(!(id && password)) {
        throw new Error('必須項目に誤りがあります')
      }
      
      //ユーザを作成
      setStatus('login')
      axiosClient.post(`/login`, {
        id: id,
        password: password,
      })
      .then((res: AxiosResponse) => {
        console.log('---ログイン---')
        console.log(res)
        if(res.status === 200) {
          document.cookie = `account=${res.data.account}`
          document.cookie = `token=${res.data.token}`
          router.push('/')
          Promise.resolve(res.data)
        } else {
          Promise.reject('ログインに失敗しました')
        }
      })
      .catch((err) => {
        setStatus('')
        alert(`ログインに失敗しました: ${err}`)
        throw err
      })

    } catch (err) {
      setStatus('')
      alert(`ログイン失敗: ${err}`)
    }
  }

  return (
    <>
      <Head>
        <title>login | wancoin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SignUpModal open={!(status === '')}>
          { status === 'login' ? <Typography>ログイン中です...</Typography> : undefined }
          <CircularProgress color="inherit" />
        </SignUpModal>
        <Container>
          <ContentWrapper>
            <Title>Login</Title>
            <FormWrapper>
              <FormItemWrapper>
                <FormTextLabel>ID</FormTextLabel>
                <FormItem id="id" required label="※必須" variant="filled" type="text" fullWidth value={id} onChange={(ev) => { setId(ev.target.value) }} />
              </FormItemWrapper>
              <FormItemWrapper>
                <FormTextLabel>パスワード</FormTextLabel>
                <FormItem id="password" required label="※必須" variant="filled" type="password" fullWidth value={password} onChange={(ev) => { setPassword(ev.target.value) }} />
              </FormItemWrapper>
            </FormWrapper>
            <ButtonWrapper>
              <LoginButton size="large" color="warning" variant="contained" onClick={login}>
                ログイン
              </LoginButton>
            </ButtonWrapper>
          </ContentWrapper>
        </Container>
      </main>
    </>
  )
}
