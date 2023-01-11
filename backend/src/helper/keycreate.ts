import * as fs from 'fs'

export default function keyCreate(domain: string, id: string) {

  if(!(domain && id)) {
    throw new Error('入力された内容が不正です')
  }

  let public_key = ''
  let private_key = ''
  const KEY_DIR = './keys/'

  let ed25519 = require('ed25519.js')
  let keys = ed25519.createKeyPair()
  let pub = keys.publicKey
  let priv = keys.privateKey

  for (var i = 0; i < 32; i++) {
    public_key = public_key + pub[i].toString(16).padStart(2, '0')
  }
  for (var i = 0; i < 32; i++) {
    private_key = private_key + priv[i].toString(16).padStart(2, '0')
  }

  fs.writeFile(KEY_DIR + id + '@' + domain + '.pub', public_key , function (err:any) {
    if (err) { console.log(err)
      throw err }
  })
  fs.writeFile(KEY_DIR + id + '@' + domain + '.priv', private_key , function (err:any) {
    if (err) { console.log(err)
      throw err }
  })

  return {
    id: id,
    domain: domain,
    pub: public_key,
    priv: private_key
  }
}