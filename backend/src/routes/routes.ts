import express from 'express'
import userController from '../controllers/user-controller'
import coinController from '../controllers/coin-controller'
import txController from '../controllers/tx-controller'

const router = express.Router()

router.get('/', (req, res) => res.status(200).json({ check: 'ok' }))
router.get('/user', userController.getUser)
router.post('/user', userController.createUser)
router.post('/user/set_detail', userController.setUserDetail)
// router.post('/coin/add', coinController.addCoin)
router.post('/coin/transfer', coinController.transferCoin)
router.get('/tx', txController.getTx)

export default router