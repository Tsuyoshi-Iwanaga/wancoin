import express from 'express'

const userController = {
  getUser: (req: express.Request, res: express.Response) => {
    try {
      res.status(200).json({
        userId: "U1000",
        userName: "Yamada Taro",
      })
    } catch (err) {
      res.status(400).json({
        message: 'error'
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