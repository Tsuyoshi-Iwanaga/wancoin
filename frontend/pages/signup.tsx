import Head from 'next/head'
import { Inter } from '@next/font/google'
import axiosClient from '../functions/fetch'
import { AxiosResponse } from 'axios'
import { Container, TextField, Paper, styled, Button, Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import { useState } from 'react'

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

const SignUpButton = styled(Button)({
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

export default function SignUp() {

  const [status, setStatus] = useState('')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const signUp = () => {
    try {
      if(!(id && name && email && password && passwordConfirm)) {
        throw new Error('必須項目に誤りがあります')
      }
      if(!(password === passwordConfirm)) {
        throw new Error('パスワードが一致しません')
      }
      
      //ユーザを作成
      setStatus('create')
      axiosClient.post(`/user`, {
        id: id,
        domain: 'tci',
      })
      .then((res: AxiosResponse) => {
        console.log('---ユーザを作成---')
        console.log(res.data[0].status[0])
        console.log(res.data[0].txHash[0])
        if(!(res.data[0].status[0] === 'COMMITTED')) {
          Promise.reject('ユーザの作成に失敗しました')
        }

        //氏名を登録
        setTimeout(() => {
          axiosClient.post(`/user/set_detail`, {
            account: `${id}@tci`,
            key: 'name',
            value: name
          })
          .then((res: AxiosResponse) => {
            console.log('---氏名を登録---')
            console.log(res.data[0].status[0])
            console.log(res.data[0].txHash[0])
            if(!(res.data[0].status[0] === 'COMMITTED')) {
              Promise.reject('氏名の登録に失敗しました')
            }
          })
          .catch((err) => {
            throw err
          })
        }, 5000)

        setTimeout(() => {
          //Emailを登録
          axiosClient.post(`/user/set_detail`, {
            account: `${id}@tci`,
            key: 'email',
            value: email
          })
          .then((res: AxiosResponse) => {
            console.log('---Email登録---')
            console.log(res.data[0].status[0])
            console.log(res.data[0].txHash[0])
            if(!(res.data[0].status[0] === 'COMMITTED')) {
              Promise.reject('Emailの登録に失敗しました')
            }
          })
          .catch((err) => {
            throw err
          })
        }, 10000)

        setTimeout(() => {
          //パスワードを登録
          axiosClient.post(`/user/set_detail`, {
            account: `${id}@tci`,
            key: 'password',
            value: password
          })
          .then((res: AxiosResponse) => {
            console.log('---パスワード登録---')
            console.log(res.data[0].status[0])
            console.log(res.data[0].txHash[0])
            if(!(res.data[0].status[0] === 'COMMITTED')) {
              Promise.reject('パスワードの登録に失敗しました')
            }
          })
          .catch((err) => {
            throw err
          })
        }, 15000)

        setTimeout(() => {
          //コインを付与
          axiosClient.post(`/coin/transfer`, {
            account_from: "admin@tci",
            account_to: `${id}@tci`,
            amount: "30",
            message: "init"
          })
          .then((res: AxiosResponse) => {
            console.log('---コイン付与---')
            console.log(res.data[0].status[0])
            console.log(res.data[0].txHash[0])
            if(!(res.data[0].status[0] === 'COMMITTED')) {
              Promise.reject('コインの付与に失敗しました')
            } else {
              Promise.resolve('ユーザの追加が成功しました')
            }
          })
          .then((res) => {
            alert(`ユーザの追加が完了しました: ${res}`)
            //フォームをリセット
            setId('')
            setName('')
            setEmail('')
            setPassword('')
            setPasswordConfirm('')
            //モーダル閉じる
            setStatus('')
          })
          .catch((err) => {
            setStatus('')
            throw err
          })
        }, 20000)

      })
      .catch((err) => {
        setStatus('')
        alert(`サーバエラーが発生しました: ${err}`)
        throw err
      })

    } catch (err) {
      setStatus('')
      alert(`ユーザ作成失敗: ${err}`)
    }
  }

  return (
    <>
      <Head>
        <title>singup | wancoin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SignUpModal open={!(status === '')}>
          { status === 'create' ? <Typography>ユーザを作成中です...</Typography> : undefined }
          { status === 'init' ? <Typography>ユーザを初期化しています...</Typography> : undefined }
          { status === 'finish' ? <Typography>作成が完了しました</Typography> : undefined }
          <CircularProgress color="inherit" />
        </SignUpModal>
        <Container>
          <ContentWrapper>
            <Title>SignUp</Title>
            <FormWrapper>
              <FormItemWrapper>
                <FormTextLabel>社員番号</FormTextLabel>
                <FormItem id="id" required label="※必須" variant="filled" type="text" fullWidth value={id} onChange={(ev) => { setId(ev.target.value) }} />
              </FormItemWrapper>
              <FormItemWrapper>
                <FormTextLabel>氏名</FormTextLabel>
                <FormItem id="name" required label="※必須" variant="filled" type="text" fullWidth value={name} onChange={(ev) => { setName(ev.target.value) }} />
              </FormItemWrapper>
              <FormItemWrapper>
                <FormTextLabel>Eメール</FormTextLabel>
                <FormItem id="email" required label="※必須" variant="filled" type="email" fullWidth value={email} onChange={(ev) => { setEmail(ev.target.value) }} />
              </FormItemWrapper>
              <FormItemWrapper>
                <FormTextLabel>パスワード</FormTextLabel>
                <FormItem id="password" required label="※必須" variant="filled" type="password" fullWidth value={password} onChange={(ev) => { setPassword(ev.target.value) }} />
              </FormItemWrapper>
              <FormItemWrapper>
                <FormTextLabel>パスワード<Typography fontSize={14}>※確認用</Typography></FormTextLabel>
                <FormItem id="password-confirm" required label="※必須" variant="filled" type="password" fullWidth value={passwordConfirm} onChange={(ev) => { setPasswordConfirm(ev.target.value) }} />
              </FormItemWrapper>
            </FormWrapper>
            <ButtonWrapper>
              <SignUpButton size="large" color="warning" variant="contained" onClick={signUp}>
                ユーザ作成
              </SignUpButton>
            </ButtonWrapper>
          </ContentWrapper>
        </Container>
      </main>
    </>
  )
}
