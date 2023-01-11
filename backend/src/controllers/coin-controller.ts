import express from 'express'
import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
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
queries.fetchCommits({
    privateKey: adminPriv,
    creatorAccountId: adminId,
    queryService,
    timeoutLimit: 4000
  },
  (block) => {
    console.log('fetchCommits new block:', util.inspect(block, false, null))
  },
  (error) => {
    throw new Error(`fetchCommits failed : ${error.stack}`)
  }
)

const coinController = {
  //STATELESS_VALIDATION_FAILEDのエラーが発生するため調査中
  addCoin: (req: express.Request, res: express.Response) => {
    try {
      const account = req.body.account
      const amount = req.body.amount

      if(!(account && amount) || isNaN(Number(amount))) {
        throw new Error('リクエスト情報に誤りがあります')
      }

      const priv_key = fs.readFileSync(
        `./keys/${account}.priv`,
        'utf-8'
      )

      Promise.all([
        commands.addAssetQuantity({
          privateKeys: [priv_key],
          creatorAccountId: account,
          quorum: 1,
          commandService,
          timeoutLimit: 5000
        }, {
          assetId: 'coin#tci',
          amount: Number(amount),
        }),
      ])
      .then((data) => {
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
  //コインを転送する
  transferCoin: (req: express.Request, res: express.Response) => {
    try {
      const account_from = req.body.account_from
      const account_to = req.body.account_to
      const amount = req.body.amount
      const message = req.body.message

      if(!(account_from && account_to && amount && message)) {
        throw new Error('リクエスト情報に誤りがあります')
      }

      const priv_key = fs.readFileSync(
        `./keys/${req.body.account_from}.priv`,
        'utf-8'
      )

      Promise.all([
        commands.transferAsset({
          privateKeys: [priv_key],
          creatorAccountId: account_from,
          quorum: 1,
          commandService,
          timeoutLimit: 5000
        }, {
          srcAccountId: account_from,
          destAccountId: account_to,
          assetId: 'coin#tci' ,
          description: message ,
          amount: amount
        }),
      ])
      .then((data) => {
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
  }
}
export default coinController