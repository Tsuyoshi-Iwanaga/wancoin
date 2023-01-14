import express from 'express'
import grpc from 'grpc'
import { QueryService_v1Client } from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import queries from 'iroha-helpers/lib/queries'

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

const txController = {
  getTx: (req: express.Request, res: express.Response) => {
    try {
      if(!req.query.account) {
        throw new Error('パラメータ指定に誤りがあります')
      }
      const account = req.query.account

      Promise.all([
        queries.getAccountTransactions({
          privateKey: adminPriv,
          creatorAccountId: adminId,
          queryService,
          timeoutLimit: 5000
        }, {
          accountId: account,
          pageSize: 10000,
          firstTxHash: null,
          ordering: {
            field: 0,
            direction: 1
          },
          firstTxTime: null,
          lastTxTime: null,
          firstTxHeight: null,
          lastTxHeight: null
        })
      ])
      .then((data) => {
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
}
export default txController