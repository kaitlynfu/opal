import express from 'express'

import {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
} from '../controllers/product-controller.js'

const productRouter = express.Router()

productRouter.post('/add', addProduct)
productRouter.get('/list', listProducts)
productRouter.post('/remove', removeProduct)
productRouter.post('/single', singleProduct)

export default productRouter