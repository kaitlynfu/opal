import './product.css'
import { useContext, useEffect, useMemo, useState } from 'react'
import { imageMap } from '../../assets/imageMap.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx' 
import { WishlistContext } from '../../context/wishlist-context.jsx'
import ProductCard from '../../components/product-card/product-card.jsx'

const Product = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const toastContext = useContext(ToastContext)

    const {
        products,
        loadingProducts,
        productError,
        addToCart
    } = useContext(ShopContext)

    const [selectedImage, setSelectedImage] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColour, setSelectedColour] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [addingToCart, setAddingToCart] = useState(false)
    const [openSection, setOpenSection] = useState('details')

    const product = useMemo(() => {
        return products.find(
            (item) =>
                String(item._id) === String(productId)
        )
    }, [products, productId])

    const wishlistContext = useContext(WishlistContext)
    const isInWishlist = wishlistContext?.isInWishlist
    const toggleWishlist = wishlistContext?.toggleWishlist
    
    const wished =
        product && isInWishlist
            ? isInWishlist(product._id)
            : false

    const productImages = useMemo(() => {
        if (!product?.image) {
            return []
        }

        const images = Array.isArray(product.image)
            ? product.image
            : [product.image]

        return images
            .map((imageName) => {
                return imageMap[imageName] || imageName
            })
            .filter(Boolean)
    }, [product])

    const colours = useMemo(() => {
        if (!product?.colours) {
            return []
        }

        return Array.isArray(product.colours)
            ? product.colours
            : [product.colours]
    }, [product])

    const sizes = useMemo(() => {
        if (!product?.sizes) {
            return []
        }

        return Array.isArray(product.sizes)
            ? product.sizes
            : [product.sizes]
    }, [product])

    const relatedProducts = useMemo(() => {
        if (!product) {
            return []
        }

        const sameCategoryProducts = products.filter((item) =>
            item._id !== product._id && item.category !== product.category
        )

        const otherProducts = products.filter((item) => 
            item._id !== product._id && item.category !== product.category
        )

        return [
            ...sameCategoryProducts,
            ...otherProducts
        ].slice(0, 4)
    }, [products, product])

    useEffect(() => {
        if (!product) {
            return
        }

        setSelectedImage(productImages[0] || '')
        setSelectedSize('')
        setSelectedColour(colours[0] || '')
        setQuantity(1)
    }, [product, productImages, colours])

    const decreaseQuantity = () => {
        setQuantity((currentQuantity) =>
            Math.max(1, currentQuantity - 1)
        )
    }

    const increaseQuantity = () => {
        setQuantity((currentQuantity) =>
            currentQuantity + 1
        )
    }

    const toggleSection = (sectionName) => {
        setOpenSection((currentSelection) => currentSelection === sectionName ? '' : sectionName)
    }

    const handleWishlist = () => {
        if (!product?._id) {
            return
        }

        toggleWishlist?.(product._id)

        toastContext?.showToast?.(
            wished
                ? `${product.name} removed from your wishlist.`
                : `${product.name} added to your wishlist.`,
            wished ? 'info' : 'success'
        )
    }

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            toastContext?.showToast?.(
                'Please log in before adding products to your cart.',
                'info'
            )

            navigate('/login')
            return
        }

        if (sizes.length > 0 && !selectedSize) {
            toastContext?.showToast?.(
                'Please select a size.',
                'error'
            )
            return
        }

        if (colours.length > 0 && !selectedColour) {
            toastContext?.showToast?.(
                'Please select a colour.',
                'error'
            )
            return
        }

        try {
            setAddingToCart(true)

            const success = await addToCart(
                product._id,
                selectedSize,
                selectedColour,
                quantity
            )

            if (success) {
                toastContext?.showToast?.(
                    `${product.name} added to your cart.`,
                    'success'
                )
            }
        } catch (error) {
            console.error('Add to cart error:', error)

            toastContext?.showToast?.(
                error?.response?.data?.message ||
                error?.message ||
                'Unable to add this product to your cart.',
                'error'
            )
        } finally {
            setAddingToCart(false)
        }
    }

    if (loadingProducts) {
        return (
            <main className='product-page product-status'>
                <p>Loading product...</p>
            </main>
        )
    }

    if (productError) {
        return (
            <main className='product-page product-status'>
                <h1>Unable to load product</h1>
                <p>{productError}</p>

                <Link to='/collection'>
                    Return to collection
                </Link>
            </main>
        )
    }

    if (!product) {
        return (
            <main className='product-page product-status'>
                <h1>Product not found</h1>
                <p>
                    This product may no longer be available.
                </p>

                <Link to='/collection'>
                    Return to collection
                </Link>
            </main>
        )
    }

    return (
        <main className='product-page'>
            <div className='product-breadcrumbs'>
                <Link to='/'>Home</Link>
                <span>/</span>

                <Link to='/collection'>
                    Collection
                </Link>
                <span>/</span>

                <p>{product.name}</p>
            </div>

            <section className='product-details'>
                <div className='product-gallery'>
                    <div className='product-thumbnails'>
                        {productImages.length > 1 ? (
                            productImages.map(
                                (image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type='button'
                                        className={
                                            selectedImage === image
                                                ? 'product-thumbnail active'
                                                : 'product-thumbnail'
                                        }
                                        onClick={() =>
                                            setSelectedImage(image)
                                        }
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                        />
                                    </button>
                                )
                            )
                        ) : (
                            <div className='product-thumbnail-placeholder' />
                        )}
                    </div>

                    <div className='product-main-image'>
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                            />
                        ) : (
                            <div className='product-image-placeholder'>
                                No image available
                            </div>
                        )}

                        {product.bestseller && (
                            <span className='product-badge'>
                                Bestseller
                            </span>
                        )}

                        <button
                            type='button'
                            className={
                                wished 
                                    ? 'wishlist-button active' 
                                    : 'wishlist-button'
                            }
                            onClick={handleWishlist}
                            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            {wished ? '♥' : '♡'}
                        </button>
                    </div>
                </div>

                <div className='product-information'>
                    <p className='product-category'>
                        {product.category}
                    </p>

                    <h1>{product.name}</h1>

                    <p className='product-price'>
                        NZD $
                        {Number(
                            product.price || 0
                        ).toFixed(2)}
                    </p>

                    <p className='product-description'>
                        {product.description}
                    </p>

                    <div className='product-divider' />

                    {colours.length > 0 && (
                        <div className='product-option'>
                            <div className='product-option-heading'>
                                <h2>Colour</h2>
                                <span>
                                    {selectedColour}
                                </span>
                            </div>

                            <div className='colour-options'>
                                {colours.map((colour) => (
                                    <button
                                        key={colour}
                                        type='button'
                                        className={
                                            selectedColour === colour
                                                ? 'colour-option active'
                                                : 'colour-option'
                                        }
                                        onClick={() => {
                                            setSelectedColour(colour)
                                        }}
                                    >
                                        {colour}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {sizes.length > 0 && (
                        <div className='product-option'>
                            <div className='product-option-heading'>
                                <h2>Select size</h2>

                                <button
                                    type='button'
                                    className='size-guide-button'
                                >
                                    Size guide
                                </button>
                            </div>

                            <div className='size-options'>
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type='button'
                                        className={
                                            selectedSize === size
                                                ? 'size-option active'
                                                : 'size-option'
                                        }
                                        onClick={() => {
                                            setSelectedSize(size)
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='product-option'>
                        <h2>Quantity</h2>

                        <div className='quantity-selector'>
                            <button
                                type='button'
                                onClick={decreaseQuantity}
                                disabled={quantity === 1}
                            >
                                −
                            </button>

                            <span>{quantity}</span>

                            <button
                                type='button'
                                onClick={increaseQuantity}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        type='button'
                        className='add-to-cart-button'
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart
                            ? 'Adding...'
                            : 'Add to Cart'}
                    </button>

                    <div className='product-benefits'>
                        <p>
                            Free shipping on orders over $100
                        </p>
                        <p>30-day returns</p>
                        <p>Secure checkout</p>
                    </div>

                    <div className='product-accordions'>
                        <div className='product-accordion'>
                            <button
                                type='button'
                                className='product-accordion-button'
                                onClick={() => toggleSection('details')}
                                aria-expanded={openSection === 'details'}
                            >
                                <span>Product details</span>
                                <span>{openSection === 'details' ? '-' : '+'}</span>
                            </button>

                            {openSection === 'details' && (
                                <div className='product-accordion-content'>
                                    <p>{product.description || 'A carefully designed wardrobe piece created for everyday comfort and style.'}</p>

                                    <ul>
                                        <li>Designed for everyday wear</li>
                                        <li>Comfortable and versatile fit</li>
                                        <li>Available in multiple sizes and colours</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className='product-accordion'>
                            <button
                                type='button'
                                className='product-accordion-button'
                                onClick={() => toggleSection('delivery')}
                                aria-expanded={openSection === 'delivery'}
                            >
                                <span>Delivery</span>
                                <span>{openSection === 'delivery' ? '-' : '+'}</span>
                            </button>

                            {openSection === 'delivery' && (
                                <div className='product-accordion-content'>
                                    <p>New Zealand delivery usually takes 2-5 working days. Orders over $100 qualify for free standard shipping.</p>
                                </div>
                            )}
                        </div>

                        <div className='product-accordion'>
                            <button
                                type='button'
                                className='product-accordion-button'
                                onClick={() => toggleSection('returns')}
                                aria-expanded={openSection === 'returns'}
                            >
                                <span>Returns</span>
                                <span>{openSection === 'returns' ? '-' : '+'}</span>
                            </button>

                            {openSection === 'returns' && (
                                <div className='product-accordion-content'>
                                    <p>Unworn items can be returned within 30 days when they are in their original condition with tags attached.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className='related-products'>
                    <div className='related-products-heading'>
                        <div>
                            <p>You may also like</p>
                            <h2>Complete the look</h2>
                        </div>

                        <Link to='/collection'>View all products</Link>
                    </div>

                    <div className='related-products-grid'>
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct._id}
                                product={relatedProduct}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}

export default Product