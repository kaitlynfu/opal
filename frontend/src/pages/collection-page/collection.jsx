import './collection.css'
import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import ProductCard from '../../components/product-card/product-card.jsx'

const Collection = () => {
    const {
        products,
        loadingProducts,
        productError
    } = useContext(ShopContext)

    const [searchParams] = useSearchParams()
    const navbarSearch = searchParams.get('search') || ''

    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSize, setSelectedSize] = useState([])
    const [selectedColour, setSelectedColour] = useState('')
    const [availability, setAvailability] = useState('')
    const [priceRange, setPriceRange] = useState(200)
    const [sortOrder, setSortOrder] = useState('default')
    const [searchTerm, setSearchTerm] = useState(navbarSearch)

    useEffect(() => {
        setSearchTerm(navbarSearch)
    }, [navbarSearch])

    const sizeChangeHandler = (size) => {
        setSelectedSize((previousSizes) =>
            previousSizes.includes(size)
                ? previousSizes.filter((item) => item !== size)
                : [...previousSizes, size]
        )
    }

    const availabilityChangeHandler = (value) => {
        setAvailability((previousValue) =>
            previousValue === value ? '' : value
        )
    }

    const colourChangeHandler = (colour) => {
        setSelectedColour((previousColour) =>
            previousColour === colour ? '' : colour
        )
    }

    const clearFilters = () => {
        setSelectedCategory('')
        setSelectedSize([])
        setSelectedColour('')
        setAvailability('')
        setPriceRange(200)
        setSortOrder('default')
    }

    const filteredProducts = [...products]
        .filter((product) => {
            const categoryMatch =
                selectedCategory === '' ||
                product.category === selectedCategory

            const searchMatch =
                searchTerm == '' ||
                product.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                product.category
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                product.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())

            const sizeMatch =
                selectedSize.length === 0 ||
                product.sizes?.some((size) =>
                    selectedSize.includes(size)
                )

            const colourMatch =
                selectedColour === '' ||
                product.colours?.includes(selectedColour)

            const priceMatch = Number(product.price) <= priceRange

            let availabilityMatch = true

            if (availability === 'in-stock') {
                availabilityMatch = product.inStock !== false
            }

            if (availability === 'bestseller') {
                availabilityMatch = product.bestseller === true
            }

            if (availability === 'new-arrival') {
                availabilityMatch = true
            }

            return categoryMatch && searchMatch && sizeMatch && colourMatch && priceMatch && availabilityMatch
        })
        .sort((a, b) => {
            if (sortOrder === 'price-asc') return Number(a.price) - Number(b.price)
            if (sortOrder === 'price-desc') return Number(b.price) - Number(a.price)
            if (sortOrder === 'bestseller') return Number(b.bestseller) - Number(a.bestseller)
            return 0
        })

    return (
        <div className="collection-container">

            {/* Filters */}
            <aside className='filter-section'>
                <div className='filter-top'>
                    <h2 className='filter-heading'>Filters</h2>
                    <button 
                        type='button'
                        className='clear-filter-btn'
                        onClick={clearFilters}
                    >
                        Clear
                    </button>
                </div>

                <div className='filter-group'>
                    <p>Category</p>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Knitwear">Knitwear</option>
                    </select>
                </div>

                <div className='filter-group'>
                    <p>Availability</p>
                    <div className='availability-grid'>
                        <button
                            type='button'
                            className={
                                availability === 'in-stock'
                                    ? 'availability-pill availability-active'
                                    : 'availability-pill'
                            }
                            onClick={() =>
                                availabilityChangeHandler('in-stock')
                            }
                        >
                            In Stock
                        </button>

                        <button
                            type='button'
                            className={
                                availability === 'bestseller'
                                    ? 'availability-pill availability-active'
                                    : 'availability-pill'
                            }
                            onClick={() =>
                                availabilityChangeHandler('bestseller')
                            }
                        >
                            Best Seller
                        </button>

                        <button
                            type='button'
                            className={
                                availability === 'new-arrival'
                                    ? 'availability-pill availability-active'
                                    : 'availability-pill'
                            }
                            onClick={() =>
                                availabilityChangeHandler('new-arrival')
                            }
                        >
                            New Arrival
                        </button>
                    </div>
                </div>

                <div className='filter-group'>
                    <p>Size</p>
                    <div className='size-filter'>
                        {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                type='button'
                                key={size}
                                className={selectedSize.includes(size) ? 'size-active' : ''}
                                onClick={() => sizeChangeHandler(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='filter-group'>
                    <p>Colours</p>
                    <div className='colour-grid'>
                        {['Black', 'White', 'Beige', 'Blue', 'Red', 'Green', 'Grey', 'Brown'].map((colour) => (
                            <button
                                type='button'
                                key={colour}
                                aria-label={`Filter by ${colour}`}
                                title={colour}
                                className={`colour ${colour.toLowerCase()} ${
                                    selectedColour === colour
                                        ? 'colour-active'
                                        : ''
                                }`}
                                onClick={() =>
                                    colourChangeHandler(colour)
                                }
                            />
                        ))}
                    </div>
                </div>

                <div className='filter-group'>
                    <p>Price Range</p>
                    <div className='price-box'>
                        <span>$0</span>
                        <span>${priceRange}</span>
                    </div>
                    <input
                        className='price-slider'
                        type='range'
                        min='0'
                        max='200'
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                    />
                </div>

                <div className="filter-benefits">
                    <h4>Why Shop Opal?</h4>
                    <div className="benefit">
                        🚚 <span>Free shipping over $100</span>
                    </div>
                    <div className="benefit">
                        ↩️ <span>30-day returns</span>
                    </div>
                    <div className="benefit">
                        ⭐ <span>Over 5,000 happy customers</span>
                    </div>
                </div>
            </aside>

            {/* Products */}
            <div className="collection-main">
                <div className='collection-search'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="collection-header">
                    <div>
                        <h1>
                            {selectedCategory
                                ? `All ${selectedCategory}`
                                : 'All Collection'}
                        </h1>
                        <p>
                            {loadingProducts
                                ? 'Loading products...'
                                : `${filteredProducts.length} products found`}
                        </p>
                    </div>

                    <select
                        className="sort-select"
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value)
                        }
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">
                            Price: Low to High
                        </option>
                        <option value="price-desc">
                            Price: High to Low
                        </option>
                        <option value="bestseller">
                            Best Seller
                        </option>
                    </select>
                </div>

                {productError && (
                    <div className='collection-message'>
                        <p>{productError}</p>
                    </div>
                )}

                {!loadingProducts && !productError && filteredProducts.length === 0 && (
                    <div className='collection-message'>
                        <h2>No products found.</h2>
                        <p>Try changing or clearing your filters.</p>
                    </div>
                )}

                {!loadingProducts && !productError && filteredProducts.length > 0 && (
                    <div className='collection-grid'>
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Collection