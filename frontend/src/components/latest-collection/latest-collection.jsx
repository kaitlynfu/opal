import './latest-collection.css'
import { useContext, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import ProductCard from '../product-card/product-card.jsx'

const LatestCollection = () => {
    const {
        products,
        loadingProducts,
        productError
    } = useContext(ShopContext)

    const featuredProducts = products.slice(0, 6)

    if (loadingProducts) {
        return (
            <section className='latest-collection'>
                <p>Loading the latest collection...</p>
            </section>
        )
    }

    if (productError) {
        return (
            <section className='latest-collection'>
                <p>{productError}</p>
            </section>
        )
    }

    return (
        <section className='latest-collection'>
            <div className='latest-collection-content'>
                <h2>Latest Collection</h2>
                <p>Discover the newest arrivals from our latest fashion collection.</p>
                <div className='product-grid'>
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>

                <Link to='/collection'>
                        <button
                            type='button'
                            className='collection-btn'
                        >
                            Explore Now
                        </button>
                </Link>
            </div>
        </section>
    )
}

export default LatestCollection