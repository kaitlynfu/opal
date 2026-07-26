import express from 'express'
import authUser from '../middleware/auth.js'

import {
    addToCart,
    removeFromCart,
    getUserCart,
    clearCart
} from '../controllers/cart-controller.js'

const cartRouter = express.Router()

cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/remove', authUser, removeFromCart)
cartRouter.get('/', authUser, getUserCart)
cartRouter.delete('/clear', authUser, clearCart)

export default cartRouter