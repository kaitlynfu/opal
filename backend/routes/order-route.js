import express from 'express'
import authUser from '../middleware/auth.js'

import {
    placeOrder,
    getUserOrders,
    getSingleOrder,
    cancelOrder
} from '../controllers/order-controller.js'

const orderRouter = express.Router()

orderRouter.post('/place', authUser, placeOrder)
orderRouter.get('/my-orders', authUser, getUserOrders)
orderRouter.get('/:orderId', authUser, getSingleOrder)
orderRouter.patch('/:orderId/cancel', authUser, cancelOrder)

export default orderRouter