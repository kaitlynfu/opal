import './product-card.css'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { imageMap } from '../../assets/imageMap.js'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'
import { WishlistContext } from '../../context/wishlist-context.jsx'

const ProductCard = ({ product }) => {
    const shopContext = useContext(ShopContext)
    const wishlistContext = useContext(WishlistContext)
    const toastContext = useContext(ToastContext)

    const productImages = Array.isArray(product?.image)
        ? product.image
        : [product?.image]

    const firstImage = productImages[0]
    const productImage = imageMap[firstImage] || firstImage || ''

    const wished = wishlistContext
        ? wishlistContext.isInWishlist(product?._id)
        : false

    const handleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!wishlistContext || !product._id) {
            return
        }

        wishlistContext.toggleWishlist(product._id)

        if (wished) {
            toastContext?.showToast?.(
                `${product.name} removed from your wishlist.`,
                'info'
            )
        } else {
            toastContext?.showToast?.(
                `${product.name} added to your wishlist.`
            )
        }
    }

    const handleQuickAdd = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!product?._id) {
            return
        }

        try {
            await Promise.resolve(
                shopContext?.addToCart?.(product._id)
            )

            toastContext?.showToast?.(
                `${product.name} added to your cart.`
            )
        } catch (error) {
            console.error('Unable to add product to cart:', error)

            toastContext?.showToast?.(
                'Unable to add this product to your cart.',
                'error'
            )
        }
    }

    return (
        <div className='product-card'>
            <Link
                to={`/product/${product._id}`}
                className='product-link'
            >
                <div className='product-image-box'>
                    {productImage ? (
                        <img
                            className='product-image'
                            src={productImage}
                            alt={product.name}
                        />
                    ) : (
                        <div className='product-card-placeholder'>
                            No image available
                        </div>
                    )}

                    {product.bestseller && (
                        <span className='product-label'>
                            Best seller
                        </span>
                    )}

                    <button
                        type='button'
                        className={wished ? 'wishlist-btn active' : 'wishlist-btn'}
                        onClick={handleWishlist}
                        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {wished ? '♥' : '♡'}
                    </button>

                    <button
                        type='button'
                        className='quick-add-btn'
                        onClick={handleQuickAdd}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        +
                    </button>
                </div>

                <div className='product-info'>
                    <h3>{product.name}</h3>
                    <p className='product-price'>
                        <span className='product-currency'>
                            NZD
                        </span>
                        ${Number(product.price || 0).toFixed(2)}
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard