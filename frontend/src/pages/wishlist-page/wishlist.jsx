import './wishlist.css'

import {
    useContext,
    useMemo,
    useState
} from 'react'

import {
    Link,
    useNavigate
} from 'react-router-dom'

import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'
import { WishlistContext } from '../../context/wishlist-context.jsx'
import ProductCard from '../../components/product-card/product-card.jsx'

const Wishlist = () => {
    const navigate = useNavigate()

    const shopContext = useContext(ShopContext)
    const wishlistContext = useContext(WishlistContext)
    const toastContext = useContext(ToastContext)

    const products = shopContext?.products || []
    const loadingProducts = shopContext?.loadingProducts
    const productError = shopContext?.productError
    const addToCart = shopContext?.addToCart

    const wishlistItems = wishlistContext?.wishlistItems || []
    const removeFromWishlist = wishlistContext?.removeFromWishlist
    const clearWishlist = wishlistContext?.clearWishlist

    const [addingProductId, setAddingProductId] = useState(null)
    const [productSelections, setProductSelections] = useState({})

    const wishlistProducts = useMemo(() => {
        return products.filter((product) =>
            wishlistItems.includes(product._id)
        )
    }, [products, wishlistItems])

    const getProductSizes = (product) => {
        if (Array.isArray(product.sizes)) {
            return product.sizes
        }

        if (product.sizes) {
            return [product.sizes]
        }

        return []
    }

    const getProductColours = (product) => {
        if (Array.isArray(product.colours)) {
            return product.colours
        }

        if (product.colours) {
            return [product.colours]
        }

        return []
    }

    const getSelection = (product) => {
        const sizes = getProductSizes(product)
        const colours = getProductColours(product)

        const savedSelection =
            productSelections[product._id] || {}

        return {
            size:
                savedSelection.size ||
                sizes[0] ||
                '',
            colour:
                savedSelection.colour ||
                colours[0] ||
                ''
        }
    }

    const updateSelection = (
        productId,
        field,
        value
    ) => {
        setProductSelections((previousSelections) => ({
            ...previousSelections,
            [productId]: {
                ...previousSelections[productId],
                [field]: value
            }
        }))
    }

    const handleRemoveItem = (product) => {
        removeFromWishlist?.(product._id)

        toastContext?.showToast?.(
            `${product.name} removed from your wishlist.`,
            'info'
        )
    }

    const handleClearWishlist = () => {
        clearWishlist?.()

        toastContext?.showToast?.(
            'Your wishlist has been cleared.',
            'info'
        )
    }

    const handleMoveToCart = async (product) => {
        const token = localStorage.getItem('token')

        if (!token) {
            toastContext?.showToast?.(
                'Please log in before adding products to your cart.',
                'info'
            )

            navigate('/login')
            return
        }

        const sizes = getProductSizes(product)
        const colours = getProductColours(product)
        const selection = getSelection(product)

        if (sizes.length > 0 && !selection.size) {
            toastContext?.showToast?.(
                'Please select a size.',
                'error'
            )
            return
        }

        if (
            colours.length > 0 &&
            !selection.colour
        ) {
            toastContext?.showToast?.(
                'Please select a colour.',
                'error'
            )
            return
        }

        try {
            setAddingProductId(product._id)

            const success = await addToCart?.(
                product._id,
                selection.size,
                selection.colour,
                1
            )

            if (success === false) {
                throw new Error(
                    'Unable to add this product to your cart.'
                )
            }

            removeFromWishlist?.(product._id)

            toastContext?.showToast?.(
                `${product.name} was moved to your cart.`
            )
        } catch (error) {
            console.error(
                'Move wishlist item to cart error:',
                error
            )

            toastContext?.showToast?.(
                error?.response?.data?.message ||
                error?.message ||
                'Unable to move this product to your cart.',
                'error'
            )
        } finally {
            setAddingProductId(null)
        }
    }

    if (loadingProducts) {
        return (
            <main className='wishlist-page wishlist-status'>
                <p>Loading your wishlist...</p>
            </main>
        )
    }

    if (productError) {
        return (
            <main className='wishlist-page wishlist-status'>
                <h1>
                    Unable to load your wishlist
                </h1>

                <p>{productError}</p>

                <Link
                    to='/collection'
                    className='wishlist-shop-button'
                >
                    Return to collection
                </Link>
            </main>
        )
    }

    return (
        <main className='wishlist-page'>
            <div className='wishlist-heading'>
                <div>
                    <p className='wishlist-eyebrow'>
                        Saved for later
                    </p>

                    <h1>My Wishlist</h1>

                    <p className='wishlist-count'>
                        {wishlistProducts.length}{' '}
                        {wishlistProducts.length === 1
                            ? 'item'
                            : 'items'}
                    </p>
                </div>

                {wishlistProducts.length > 0 && (
                    <button
                        type='button'
                        className='clear-wishlist-button'
                        onClick={handleClearWishlist}
                    >
                        Clear wishlist
                    </button>
                )}
            </div>

            {wishlistProducts.length === 0 ? (
                <section className='empty-wishlist'>
                    <div className='empty-wishlist-heart'>
                        ♡
                    </div>

                    <h2>Your wishlist is empty</h2>

                    <p>
                        Save your favourite pieces by selecting the heart icon on any product.
                    </p>

                    <Link
                        to='/collection'
                        className='wishlist-shop-button'
                    >
                        Explore collection
                    </Link>
                </section>
            ) : (
                <section className='wishlist-grid'>
                    {wishlistProducts.map((product) => {
                        const sizes = getProductSizes(product)
                        const colours = getProductColours(product)
                        const selection = getSelection(product)
                        const isAdding = addingProductId === product._id

                        return (
                            <div key={product._id} className='wishlist-product'>
                                <ProductCard product={product}/>

                                {(sizes.length > 0 || colours.length > 0) && (
                                    <div className='wishlist-options'>
                                        {sizes.length > 0 && (
                                            <label className='wishlist-option-field'>
                                                <span>Size</span>

                                                <select
                                                    value={selection.size}
                                                    onChange={(e) => updateSelection(product._id, 'size', e.target.value)}
                                                >
                                                    {sizes.map((size) => (
                                                            <option
                                                                key={size}
                                                                value={size}
                                                            >
                                                                {size}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>
                                        )}

                                        {colours.length > 0 && (
                                            <label className='wishlist-option-field'>
                                                <span>Colour</span>

                                                <select
                                                    value={selection.colour}
                                                    onChange={(e) => updateSelection(product._id, 'colour', e.target.value)}
                                                >
                                                    {colours.map((colour) => (
                                                            <option
                                                                key={colour}
                                                                value={colour}
                                                            >
                                                                {colour}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>
                                        )}
                                    </div>
                                )}

                                <div className='wishlist-product-actions'>
                                    <button
                                        type='button'
                                        className='wishlist-cart-button'
                                        onClick={() => handleMoveToCart(product)}
                                        disabled={isAdding}
                                    >
                                        {isAdding
                                            ? 'Adding...'
                                            : 'Move to Cart'}
                                    </button>

                                    <button
                                        type='button'
                                        className='wishlist-remove-button'
                                        onClick={() => handleRemoveItem(product)}
                                        disabled={isAdding}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </section>
            )}
        </main>
    )
}

export default Wishlist