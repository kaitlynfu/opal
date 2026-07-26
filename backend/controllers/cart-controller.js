import userModel from '../models/user-model.js'

const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required.'
            })
        }

        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        const currentQuantity = user.cartData.get(itemId) || 0

        user.cartData.set(itemId, currentQuantity + 1)
        await user.save()

        return res.json({
            success: true,
            message: 'Product has been added to the cart.',
            cartData: Object.fromEntries(user.cartData)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body
        
        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required.'
            })
        }

        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        const currentQuantity = user.cartData.get(itemId) || 0

        if (currentQuantity > 1) {
            user.cartData.set(itemId, currentQuantity - 1)
        } else {
            user.cartData.delete(itemId)
        }

        await user.save()

        return res.json({
            success: true,
            message: 'Cart updated.',
            cartData: Object.fromEntries(user.cartData)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        return res.json({
            success: true,
            cartData: Object.fromEntries(user.cartData)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const clearCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        user.cartData.clear()
        await user.save()

        return res.json({
            success: true,
            message: 'Cart cleared.',
            cartData: {}
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    addToCart,
    removeFromCart,
    getUserCart,
    clearCart
}