import productModel from '../models/product-model.js'

const addProduct = async (req, res) => {
    try {
        const product = new productModel(req.body)
        await product.save()

        res.json({
            success: true,
            message: 'Product has been added successfully!'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        
        res.json({
            success: true,
            products
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)

        res.json({
            success: true,
            message: 'Product has been removed successfully!'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const singleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.productId)

        res.json({
            success: true,
            product
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
}