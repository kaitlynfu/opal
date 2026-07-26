import orderModel from '../models/order-model.js'
import userModel from '../models/user-model.js'

const placeOrder = async (req, res) => {
    try {
        const {
            items,
            amount,
            address,
            paymentMethod = 'COD'
        } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty.'
            })
        }

        const order = await orderModel.create({
            userId: req.userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: false,
            status: 'Order Placed'
        })

        await userModel.findByIdAndUpdate(req.userId, {
            cartData: {}
        })

        return res.status(201).json({
            success: true,
            message: 'Order has been placed successfully!',
            order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    } 
}

const getUserOrders = async (req, res) => {
    try {
        const orders = (await orderModel.find({ userId: req.userId })).toSorted({ createdAt: -1 })

        return res.json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const order = await orderModel.findOne({
            _id: req.params.orderId,
            userId: req.userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            })
        }

        return res.json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    } 
}

const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findOne({
            _id: req.params.orderId,
            userId: req.userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            })
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'A delivered order cannot be cancelled.'
            })
        }

        order.status = 'Cancelled'
        await order.save()

        return res.json({
            success: true,
            message: 'Order cancelled.',
            order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    placeOrder,
    getUserOrders,
    getSingleOrder,
    cancelOrder
}