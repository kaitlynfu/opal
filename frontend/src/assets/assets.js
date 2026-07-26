/* Assets */
import opal_logo from './opal.png'
import hero_img from './hero.png'
import hero_img1 from './hero_img1.png'
import hero_img2 from './hero_img2.png'
import hero_img3 from './hero_img3.png'
import quality_icon from './quality_icon.png'
import exchange_icon from './exchange.png'
import system_icon from './system_icon.png'

/* Products */
import p_img1 from './products/p_img1.png'
import p_img2 from './products/p_img2.png'
import p_img2_1 from './products/p_img2_1.png'
import p_img2_2 from './products/p_img2_2.png'
import p_img3 from './products/p_img3.png'
import p_img4 from './products/p_img4.png'
import p_img4_1 from './products/p_img4_1.png'
import p_img5 from './products/p_img5.png'
import p_img6 from './products/p_img6.png'
import p_img7 from './products/p_img7.png'
import p_img8 from './products/p_img8.png'
import p_img9 from './products/p_img9.png'
import p_img10 from './products/p_img10.png'
import p_img11 from './products/p_img11.png'
import p_img12 from './products/p_img12.png'
import p_img13 from './products/p_img13.png'
import p_img14 from './products/p_img14.png'
import p_img15 from './products/p_img15.png'
import p_img16 from './products/p_img16.png'
import p_img17 from './products/p_img17.png'
import p_img18 from './products/p_img18.png'
import p_img19 from './products/p_img19.png'
import p_img20 from './products/p_img20.png'
import p_img21 from './products/p_img21.png'
import p_img22 from './products/p_img22.png'
import p_img23 from './products/p_img23.png'
import p_img24 from './products/p_img24.png'
import p_img25 from './products/p_img25.png'
import p_img26 from './products/p_img26.png'
import p_img27 from './products/p_img27.png'
import p_img28 from './products/p_img28.png'

export const assets = {
    opal_logo,
    hero_img,
    hero_img1,
    hero_img2,
    hero_img3,
    quality_icon,
    exchange_icon,
    system_icon
}

export const products = [
    {
        _id: "1",
        name: "Backless Buckle Halter Top",
        description: "Opal's Going Out Top",
        price: 29.99,
        image: [p_img1],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Black"],
        date: 1223256778,
        bestseller: true,
        inStock: true
    },
    {
        _id: "2",
        name: "Button Up Split Broderie Top",
        description: "Opal's Going Out Top",
        price: 34.99,
        image: [p_img2, p_img2_1, p_img2_2],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1234567890,
        bestseller: false,
        inStock: true
    },
    {
        _id: "3",
        name: "Boxer Straight Leg Jean",
        description: "Opal's Straight Jeans",
        price: 79.99,
        image: [p_img3],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1245678901,
        bestseller: false,
        inStock: true
    },
    {
        _id: "4",
        name: "Low Rise Wide Leg Jean",
        description: "Opal's Wide Leg Jeans",
        price: 65.99,
        image: [p_img4, p_img4_1],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["White"],
        date: 1256789012,
        bestseller: false,
        inStock: true
    },
    {
        _id: "5",
        name: "Halter Mini Dress",
        description: "Opal's Mini Dress",
        price: 79.99,
        image: [p_img5],
        category: "Dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Black"],
        date: 1267890123,
        bestseller: false,
        inStock: false
    },
    {
        _id: "6",
        name: "Longline Crew Cotton Knit Jumper",
        description: "Opal's Knitwear",
        price: 49.99,
        image: [p_img6],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Grey"],
        date: 1278901234,
        bestseller: false,
        inStock: true
    },
    {
        _id: "7",
        name: "Cotton V Neck Knit Jumper",
        description: "Opal's Knitwear",
        price: 49.99,
        image: [p_img7],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1289012345,
        bestseller: false,
        inStock: true
    },
    {
        _id: "8",
        name: "Collared Bomber Jacket",
        description: "Opal's Outerwear",
        price: 94.99,
        image: [p_img8],
        category: "Outerwear",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Black"],
        date: 1290123456,
        bestseller: false,
        inStock: true
    },
    {
        _id: "9",
        name: "Longline Cargo Shorts",
        description: "Opal's Shorts",
        price: 32.99,
        image: [p_img9],
        category: "Bottoms",
        sizes: ["S", "M", "L"],
        colours: ["White"],
        date: 1301234567,
        bestseller: false,
        inStock: true
    },
    {
        _id: "10",
        name: "Button-Up Denim Skirt",
        description: "Opal's Skirts",
        price: 32.99,
        image: [p_img10],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1312345678,
        bestseller: false,
        inStock: true
    },
    {
        _id: "11",
        name: "Ruched Off-Shoulder Top",
        description: "Opal's Going Out Top",
        price: 25.99,
        image: [p_img11],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Black"],
        date: 1323456789,
        bestseller: true,
        inStock: true
    },
    {
        _id: "12",
        name: "Striped Polo Rugby Jumper",
        description: "Opal's Jumper",
        price: 49.99,
        image: [p_img12],
        category: "Tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Red"],
        date: 1334567890,
        bestseller: false,
        inStock: true
    },
    {
        _id: "13",
        name: "Terry Off-Shoulder Maxi Dress",
        description: "Opal's Going Out Dress",
        price: 98.99,
        image: [p_img13],
        category: "Dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Brown"],
        date: 1345678901,
        bestseller: false,
        inStock: true
    },
    {
        _id: "14",
        name: "Hughes Original Denim Jacket",
        description: "Opal's Outerwear",
        price: 115.99,
        image: [p_img14],
        category: "Outerwear",
        sizes: ["S", "M", "L"],
        colours: ["Black"],
        date: 1356789012,
        bestseller: false,
        inStock: true
    },
    {
        _id: "15",
        name: "High Rise Wide Leg Jeans",
        description: "Opal's Wide Leg Jeans",
        price: 75.99,
        image: [p_img15],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1367890123,
        bestseller: false,
        inStock: true
    },
    {
        _id: "16",
        name: "Fitted Button Up Knit Cardigan",
        description: "Opal's Cardigans",
        price: 39.99,
        image: [p_img16],
        category: ["Tops", "Knitwear"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Grey"],
        date: 1378901234,
        bestseller: true,
        inStock: true
    },
    {
        _id: "17",
        name: "Lacey Bow Denim Top",
        description: "Opal's Going Out Top",
        price: 36.99,
        image: [p_img17],
        category: "Tops",
        sizes: ["S", "M", "L"],
        colours: ["Blue"],
        date: 1389012345,
        bestseller: false,
        inStock: true
    },
    {
        _id: "18",
        name: "Backless Buckle Walter Denim Top",
        description: "Opal's Going Out Top",
        price: 35.99,
        image: [p_img18],
        category: "Tops",
        sizes: ["XS", "S", "M"],
        colours: ["Blue"],
        date: 1390123456,
        bestseller: false,
        inStock: true
    },
    {
        _id: "19",
        name: "Button Up Knit Cardigan",
        description: "Opal's Cardigans",
        price: 45.99,
        image: [p_img19],
        category: "Tops",
        sizes: ["M", "L", "XL"],
        colours: ["Blue"],
        date: 1401234567,
        bestseller: false,
        inStock: true
    },
    {
        _id: "20",
        name: "Newport Oversized Sweatshirt",
        description: "Opal's Jumper",
        price: 49.99,
        image: [p_img20],
        category: "Tops",
        sizes: ["M", "L", "XL"],
        colours: ["White"],
        date: 1412345678,
        bestseller: false,
        inStock: true
    },
    {
        _id: "21",
        name: "Classic Tank Top",
        description: "Opal's Tops",
        price: 18.99,
        image: [p_img21],
        category: "Tops",
        sizes: ["XS", "L", "XL"],
        colours: ["Black"],
        date: 1423456789,
        bestseller: false,
        inStock: true
    },
    {
        _id: "22",
        name: "Classic Navy High Rise Straight Jean",
        description: "Opal's Straight Jeans",
        price: 74.99,
        image: [p_img22],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Blue"],
        date: 1434567890,
        bestseller: false,
        inStock: true
    },
    {
        _id: "23",
        name: "Pauline Knitted Jumper",
        description: "Opal's Knitwear",
        price: 49.99,
        image: [p_img23],
        category: "Tops",
        sizes: ["M", "L", "XL"],
        colours: ["Brown"],
        date: 1445678901,
        bestseller: false,
        inStock: true
    },
    {
        _id: "24",
        name: "White Ruffled Mini Dress",
        description: "Opal's Mini Dresses",
        price: 76.99,
        image: [p_img24],
        category: "Dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["White"],
        date: 1456789012,
        bestseller: false,
        inStock: true
    },
    {
        _id: "25",
        name: "Classic Blue Oversized Blouse",
        description: "Opal's Tops",
        price: 52.99,
        image: [p_img25],
        category: "Tops",
        sizes: ["M", "L", "XL"],
        colours: ["Blue"],
        date: 1467890123,
        bestseller: false,
        inStock: true
    },
    {
        _id: "26",
        name: "Silk Cheetah Print Midi Skirt",
        description: "Opal's Skirts",
        price: 55.99,
        image: [p_img26],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Beige"],
        date: 1478901234,
        bestseller: true,
        inStock: true
    },
    {
        _id: "27",
        name: "Basic Black Denim Skirt",
        description: "Opal's Skirts",
        price: 32.99,
        image: [p_img27],
        category: "Bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
        colours: ["Black"],
        date: 1489012345,
        bestseller: false,
        inStock: true
    },
    {
        _id: "28",
        name: "San Francisco Oversized Tee",
        description: "Opal's T-Shirts",
        price: 25.99,
        image: [p_img28],
        category: "Tops",
        sizes: ["M", "L", "XL"],
        colours: ["White"],
        date: 1490123456,
        bestseller: false,
        inStock: false
    }
]

export {
    p_img1,
    p_img2,
    p_img2_1,
    p_img2_2,
    p_img3,
    p_img4,
    p_img4_1,
    p_img5,
    p_img6,
    p_img7,
    p_img8,
    p_img9,
    p_img10,
    p_img11,
    p_img12,
    p_img13,
    p_img14,
    p_img15,
    p_img16,
    p_img17,
    p_img18,
    p_img19,
    p_img20,
    p_img21,
    p_img22,
    p_img23,
    p_img24,
    p_img25,
    p_img26,
    p_img27,
    p_img28
}