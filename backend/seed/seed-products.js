import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productModel from '../models/product-model.js'

dotenv.config()

const products = [
    {
        name: 'Backless Buckle Halter Top',
        description: "Opal's Going Out Top",
        price: 29.99,
        image: ['p_img1.png'],
        category: 'Tops',
        subCategory: 'Going Out',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Black'],
        bestseller: true,
        inStock: true
    },
    {
        name: 'Button Up Split Broderie Top',
        description: "Opal's Going Out Top",
        price: 34.99,
        image: ['p_img2.png', 'p_img2_1.png', 'p_img2_2.png'],
        category: 'Tops',
        subCategory: 'Going Out',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Boxer Straight Leg Jean',
        description: "Opal's Straight Jeans",
        price: 79.99,
        image: ['p_img3.png'],
        category: 'Bottoms',
        subCategory: 'Jeans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Low Rise Wide Leg Jean',
        description: "Opal's Wide Leg Jeans",
        price: 65.99,
        image: ['p_img4.png', 'p_img4_1.png'],
        category: 'Bottoms',
        subCategory: 'Jeans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['White'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Halter Mini Dress',
        description: "Opal's Mini Dress",
        price: 79.99,
        image: ['p_img5.png'],
        category: 'Dresses',
        subCategory: 'Mini Dresses',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Black'],
        bestseller: false,
        inStock: false
    },
    {
        name: 'Longline Crew Cotton Knit Jumper',
        description: "Opal's Knitwear",
        price: 49.99,
        image: ['p_img6.png'],
        category: 'Knitwear',
        subCategory: 'Jumpers',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Grey'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Cotton V Neck Knit Jumper',
        description: "Opal's Knitwear",
        price: 49.99,
        image: ['p_img7.png'],
        category: 'Knitwear',
        subCategory: 'Jumpers',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Collared Bomber Jacket',
        description: "Opal's Outerwear",
        price: 94.99,
        image: ['p_img8.png'],
        category: 'Outerwear',
        subCategory: 'Jackets',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Black'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Longline Cargo Shorts',
        description: "Opal's Shorts",
        price: 32.99,
        image: ['p_img9.png'],
        category: 'Bottoms',
        subCategory: 'Shorts',
        sizes: ['S', 'M', 'L'],
        colours: ['White'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Button-Up Denim Skirt',
        description: "Opal's Skirts",
        price: 32.99,
        image: ['p_img10.png'],
        category: 'Bottoms',
        subCategory: 'Skirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Ruched Off-Shoulder Top',
        description: "Opal's Going Out Top",
        price: 25.99,
        image: ['p_img11.png'],
        category: 'Tops',
        subCategory: 'Going Out',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Black'],
        bestseller: true,
        inStock: true
    },
    {
        name: 'Striped Polo Rugby Jumper',
        description: "Opal's Jumper",
        price: 49.99,
        image: ['p_img12.png'],
        category: 'Knitwear',
        subCategory: 'Jumpers',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Red'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Terry Off-Shoulder Maxi Dress',
        description: "Opal's Going Out Dress",
        price: 98.99,
        image: ['p_img13.png'],
        category: 'Dresses',
        subCategory: 'Maxi Dresses',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Brown'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Hughes Original Denim Jacket',
        description: "Opal's Outerwear",
        price: 115.99,
        image: ['p_img14.png'],
        category: 'Outerwear',
        subCategory: 'Jackets',
        sizes: ['S', 'M', 'L'],
        colours: ['Black'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'High Rise Wide Leg Jeans',
        description: "Opal's Wide Leg Jeans",
        price: 75.99,
        image: ['p_img15.png'],
        category: 'Bottoms',
        subCategory: 'Jeans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Fitted Button Up Knit Cardigan',
        description: "Opal's Cardigans",
        price: 39.99,
        image: ['p_img16.png'],
        category: 'Knitwear',
        subCategory: 'Cardigans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Grey'],
        bestseller: true,
        inStock: true
    },
    {
        name: 'Lacey Bow Denim Top',
        description: "Opal's Going Out Top",
        price: 36.99,
        image: ['p_img17.png'],
        category: 'Tops',
        subCategory: 'Going Out',
        sizes: ['S', 'M', 'L'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Backless Buckle Halter Denim Top',
        description: "Opal's Going Out Top",
        price: 35.99,
        image: ['p_img18.png'],
        category: 'Tops',
        subCategory: 'Going Out',
        sizes: ['XS', 'S', 'M'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Button Up Knit Cardigan',
        description: "Opal's Cardigans",
        price: 45.99,
        image: ['p_img19.png'],
        category: 'Knitwear',
        subCategory: 'Cardigans',
        sizes: ['M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Newport Oversized Sweatshirt',
        description: "Opal's Jumper",
        price: 49.99,
        image: ['p_img20.png'],
        category: 'Tops',
        subCategory: 'Sweatshirts',
        sizes: ['M', 'L', 'XL'],
        colours: ['White'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Classic Tank Top',
        description: "Opal's Tops",
        price: 18.99,
        image: ['p_img21.png'],
        category: 'Tops',
        subCategory: 'Basics',
        sizes: ['XS', 'L', 'XL'],
        colours: ['Black'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Classic Navy High Rise Straight Jean',
        description: "Opal's Straight Jeans",
        price: 74.99,
        image: ['p_img22.png'],
        category: 'Bottoms',
        subCategory: 'Jeans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Pauline Knitted Jumper',
        description: "Opal's Knitwear",
        price: 49.99,
        image: ['p_img23.png'],
        category: 'Knitwear',
        subCategory: 'Jumpers',
        sizes: ['M', 'L', 'XL'],
        colours: ['Brown'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'White Ruffled Mini Dress',
        description: "Opal's Mini Dresses",
        price: 76.99,
        image: ['p_img24.png'],
        category: 'Dresses',
        subCategory: 'Mini Dresses',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['White'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Classic Blue Oversized Blouse',
        description: "Opal's Tops",
        price: 52.99,
        image: ['p_img25.png'],
        category: 'Tops',
        subCategory: 'Blouses',
        sizes: ['M', 'L', 'XL'],
        colours: ['Blue'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'Silk Cheetah Print Midi Skirt',
        description: "Opal's Skirts",
        price: 55.99,
        image: ['p_img26.png'],
        category: 'Bottoms',
        subCategory: 'Skirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Beige'],
        bestseller: true,
        inStock: true
    },
    {
        name: 'Basic Black Denim Skirt',
        description: "Opal's Skirts",
        price: 32.99,
        image: ['p_img27.png'],
        category: 'Bottoms',
        subCategory: 'Skirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colours: ['Black'],
        bestseller: false,
        inStock: true
    },
    {
        name: 'San Francisco Oversized Tee',
        description: "Opal's T-Shirts",
        price: 25.99,
        image: ['p_img28.png'],
        category: 'Tops',
        subCategory: 'T-Shirts',
        sizes: ['M', 'L', 'XL'],
        colours: ['White'],
        bestseller: false,
        inStock: false
    }
]

const seedProducts = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from the .env file.')
        }

        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected.')

        await productModel.deleteMany({})
        console.log('Old products deleted.')

        const insertedProducts = await productModel.insertMany(products)

        console.log(`${insertedProducts.length} products added successfully.`)
    } catch (error) {
        console.error('Unable to seed products:', error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
        console.log('MongoDB disconnected.')
    }
}

seedProducts()