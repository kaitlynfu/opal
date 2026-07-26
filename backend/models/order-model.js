import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },

        items: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'product',
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    image: {
                        type: String,
                        default: ''
                    },
                    size: {
                        type: String,
                        default: ''
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1
                    },
                    price: {
                        type: Number,
                        required: true,
                        min: 0
                    }
                }
            ],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        address: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: ['COD', 'Card', 'PayPal', 'Apple Pay'],
            default: 'COD'
        },

        payment: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: [
                'Order Placed',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled'
            ],
            default: 'Order Placed'
        }
    },
    {
        timestamps: true
    }
)

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel