import express from 'express'
import userController from '../controllers/user-controller'
import coinController from '../controllers/coin-controller'

const router = express.Router()

router.get('/user', userController.getUser)
router.post('/user', userController.createUser)
router.post('/coin/add', coinController.addCoin)
router.post('/coin/transfer', coinController.transferCoin)

export default router