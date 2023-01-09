import express from 'express'
import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import keyCreate from '../helper/keycreate'

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

const userController = {
  //ユーザ情報を得る
  getUser: (req: express.Request, res: express.Response) => {
    try {
      Promise.all([
        queries.getAccount({
          privateKey: adminPriv,
          creatorAccountId: adminId,
          queryService,
          timeoutLimit: 5000
        }, {
          accountId: req.query.name
        }),
        // queries.getAccountAssets({
        //   privateKey: adminPriv,
        //   creatorAccountId: adminId,
        //   queryService,
        //   timeoutLimit: 5000
        // }, {
        //   accountId: 'admin@test',
        //   pageSize: 1,
        //   firstAssetId: 1
        // })
      ])
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
    } catch (err) {
      res.status(400).json({
        message: 'error: from Express'
      })
    }
  },
  //ユーザを作成する
  createUser: (req: express.Request, res: express.Response) => {
    try {
      const { account, domain, pub, priv } = keyCreate(req.body.domain, req.body.account)

      if(!(account && domain && pub && priv)) {
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
          accountName: account ,
          domainId: domain,
          publicKey: pub
        })
      ])
      .then(data => {
        res.status(200).json(Object.assign(data, { account, domain, pub, priv }))
      })
      .catch(err => {
        throw new Error(`${err.message}: account creation failed..`)
      })
      .finally(() => {
        process.exit(0)
      })

    } catch (err) {
      res.status(400).json({
        message: err ? err : 'Error!!'
      })
    }
  }
}
export default userController