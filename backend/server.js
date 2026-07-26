import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import productRouter from './routes/product-route.js'
import userRouter from './routes/user-route.js'
import cartRouter from './routes/cart-route.js'
import orderRouter from './routes/order-route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB is connected.')).catch((error) => console.log(error))
app.get('/', (req, res) => {res.send('Opal backend is running.')})
app.use('/api/products', productRouter)
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})