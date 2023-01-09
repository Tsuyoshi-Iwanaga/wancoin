import express from 'express'
import grpc from 'grpc'
import {
  QueryService_v1Client,
  CommandService_v1Client
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'

//load env
require('dotenv').config()

const adminId = process.env.ADMIN_ID
const adminPriv = process.env.ADMIN_PRIVATE_KEY
const irohaEndpoint = process.env.IROHA_ADDRESS

//client
const queryService = new QueryService_v1Client(
  irohaEndpoint ? irohaEndpoint : '',
  grpc.credentials.createInsecure(),
)
const commandService = new CommandService_v1Client(
  irohaEndpoint ? irohaEndpoint : '',
  grpc.credentials.createInsecure()
)

const userController = {
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
  createUser: (req: express.Request, res: express.Response) => {
    try {
      res.status(200).json({
        message: "登録完了"
      })
    } catch (err) {
      res.status(400).json({
        message: 'error'
      })
    }
  }
}
export default userController