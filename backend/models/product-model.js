import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            type: [String],
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        sizes: {
            type: [String],
            default: [],
        },

        date: {
            type: Date,
            default: Date.now,
        },

        bestseller: {
            type: Boolean,
            default: false,
        },

        inStock: {
            type: Boolean,
            default: true,
        },

        colours: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel