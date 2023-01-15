import express from 'express'
import grpc from 'grpc'
import { QueryService_v1Client } from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import queries from 'iroha-helpers/lib/queries'
import passwordHandler from '../helper/hash'

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

const authController = {
  login: (req: express.Request, res: express.Response) => {
    try {
      if(!(req.body.id && req.body.password)) {
        throw new Error('パラメータ指定に誤りがあります')
      }
      const id = req.body.id
      const password = req.body.password

      Promise.all([
        queries.getAccount({
          privateKey: adminPriv,
          creatorAccountId: adminId,
          queryService,
          timeoutLimit: 5000
        }, {
          accountId: `${id}@tci`
        }),
      ])
      .then((data: any) => {
        const accountId = data[0].accountId
        const hashedPassword = JSON.parse(data[0].jsonData)[accountId].password

        if(passwordHandler.compare(password, hashedPassword)) {
          res.status(200).json({
            message: 'login success',
            account: accountId,
            token: hashedPassword,
          })
        } else {
          res.status(403).json({
            message: 'login failed',
          })
        }
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
}
export default authController