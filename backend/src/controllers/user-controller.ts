import express, { Errback } from 'express'
import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import keyCreate from '../helper/keycreate'
import passwordHandler from '../helper/hash'
import * as fs from 'fs'

const util = require('util')

//load env
require('dotenv').config()
const adminId = process.env.ADMIN_ID || ''
const adminPriv = process.env.ADMIN_PRIVATE_KEY || ''
const irohaEndpoint = process.env.IROHA_ADDRESS || ''

//client
const queryService = new QueryService_v1Client(
  irohaEndpoint ? irohaEndpoint : '',
  grpc.credentials.createInsecure(),
)
const commandService = new CommandService_v1Client(
  irohaEndpoint ? irohaEndpoint : '',
  grpc.credentials.createInsecure()
)
//コマンド実行後に完了したブロックを収集
// queries.fetchCommits({
//     privateKey: adminPriv,
//     creatorAccountId: adminId,
//     queryService,
//     timeoutLimit: 4000
//   },
//   (block) => {
//     console.log('fetchCommits new block:', util.inspect(block, false, null))
//   },
//   (error) => {
//     throw new Error(`fetchCommits failed : ${error.stack}`)
//   }
// )

const userController = {
  //ユーザ情報を得る
  getUser: (req: express.Request, res: express.Response) => {
    try {
      if(!req.query.account) {
        throw new Error('パラメータ指定に誤りがあります')
      }
      Promise.all([
        queries.getAccount({
          privateKey: adminPriv,
          creatorAccountId: adminId,
          queryService,
          timeoutLimit: 5000
        }, {
          accountId: req.query.account
        }),
        queries.getAccountAssets({
          privateKey: adminPriv,
          creatorAccountId: adminId,
          queryService,
          timeoutLimit: 5000
        }, {
          accountId: req.query.account,
          pageSize: 100,
          firstAssetId: null
        })
      ])
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(400).json(err.message)
      })
    } catch (err) {
      res.status(400).json({
        message: err ? err : 'Express Error!!'
      })
    }
  },
  //ユーザを作成する
  createUser: (req: express.Request, res: express.Response) => {
    try {
      const { id, domain, pub, priv } = keyCreate(req.body.domain, req.body.id)

      if(!(id && domain && pub && priv)) {
        throw new Error('keypair creation failed..')
      }

      Promise.all([
        commands.createAccount({
          privateKeys: [adminPriv],
          creatorAccountId: adminId,
          quorum: 1,
          commandService,
          timeoutLimit: 5000
        }, {
          accountName: id ,
          domainId: domain,
          publicKey: pub
        }),
      ])
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(400).json(err.message)
      })
      .finally(() => {
        process.exit(0)
      })
    } catch (err) {
      res.status(400).json({
        message: err ? err : 'Express Error!!'
      })
    }
  },
  //ユーザ情報を設定する
  setUserDetail: (req: express.Request, res: express.Response) => {
    try {
      if(!(req.body.account && req.body.key && req.body.value )) {
        throw new Error('パラメータ指定に誤りがあります')
      }
      const account = req.body.account
      const key = req.body.key
      const value = req.body.value

      const priv_key = fs.readFileSync(
        `./keys/${account}.priv`,
        'utf-8'
      )
      
      Promise.all([
        commands.setAccountDetail({
          privateKeys: [priv_key],
          creatorAccountId: account,
          quorum: 1,
          commandService,
          timeoutLimit: 5000
        }, {
          accountId: account,
          key: key,
          //passwordだけハッシュ化して保持する
          value: key === 'password' ? passwordHandler.hash(value) : value,
        })
      ])
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(400).json(err.message)
      })
      .finally(() => {
        process.exit(0)
      })
    } catch (err) {
      res.status(400).json({
        message: err ? err : 'Express Error!!'
      })
    }
  },
}
export default userController