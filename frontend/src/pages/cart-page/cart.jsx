import './cart.css'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'
import { imageMap } from '../../assets/imageMap.js'

const Cart = () => {
    const {
        products = [],
        cartItems = {},
        addToCart,
        removeFromCart,
        getCartAmount
    } = useContext(ShopContext)

    const cartProducts = products.filter(
        (product) => Number(cartItems[product._id]) > 0
    )

    const subtotal = Number(getCartAmount?.() || 0)
    const freeShippingMinimum = 100
    const shippingCost = subtotal >= freeShippingMinimum ? 0 : 10
    const total = subtotal + shippingCost
    const amountUntilFreeShipping = Math.max(freeShippingMinimum - subtotal, 0)
    const shippingProgress = Math.min((subtotal / freeShippingMinimum) * 100, 100)

    const { showToast } = useContext(ToastContext)

    const removeItemCompletely = async (productId, productName) => {
        const quantity = Number(cartItems[productId] || 0)

        for (let index = 0; index < quantity; index += 1) {
            await Promise.resolve(
                removeFromCart(productId)
            )
        }

        showToast?.(
            `${productName} was removed from your cart.`,
            'info'
        )
    }

    const clearCart = async () => {
        for (const product of cartProducts) {
            const quantity = Number(cartItems[product._id] || 0)

            for (let index = 0; index < quantity; index += 1) {
                await Promise.resolve(
                    removeFromCart(product._id)
                )
            }

            showToast?.(
                'Your cart has been cleared.',
                'info'
            )
        }
    }

    const increaseQuantity = async (product) => {
        try {
            await Promise.resolve(
                addToCart(product._id)
            )

            showToast?.(
                `${product.name} quantity increased.`
            )
        } catch (error) {
            console.error(error)

            showToast?.(
                'Unable to update the cart.',
                'error'
            )
        }
    }

    const decreaseQuantity = async (product) => {
        try {
            await Promise.resolve(
                removeFromCart(product._id)
            )

            showToast?.(
                `${product.name} quantity updated.`,
                'info'
            )
        } catch (error) {
            console.error(error)

            showToast?.(
                'Unable to update the cart.',
                'error'
            )
        }
    }

    return (
        <main className='cart-page'>
            <div className='cart-title-section'>
                <div>
                    <p className='cart-eyebrow'>
                        Your selected pieces
                    </p>

                    <h1>Shopping Cart</h1>

                    <p className='cart-item-count'>
                        {cartProducts.length}{' '}
                        {cartProducts.length === 1
                            ? 'product'
                            : 'products'}
                    </p>
                </div>

                {cartProducts.length > 0 && (
                    <button
                        type='button'
                        className='clear-cart-button'
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {cartProducts.length === 0 ? (
                <section className='empty-cart'>
                    <div className='empty-cart-icon'>
                        🛍
                    </div>

                    <h2>Your cart is empty</h2>
                    <p>Explore the latest Opal collection and add you favourite pieces.</p>

                    <Link
                        to='/collection'
                        className='continue-shopping-button'
                    >
                        Continue Shopping
                    </Link>
                </section>
            ) : (
                <> 
                    <section className='shipping-progress-section'>
                        {amountUntilFreeShipping > 0 ? (
                            <p>
                                Add{' '}
                                <strong>
                                    ${amountUntilFreeShipping.toFixed(2)}
                                </strong>{' '}
                                more to recieve free shipping.
                            </p>
                        ) : (
                            <p>
                                You have unlocked{' '}
                                <strong>free shipping.</strong>
                            </p>
                        )}

                        <div className='shipping-progress-track'>
                            <div
                                className='shipping-progress-bar'
                                style={{
                                    width: `${shippingProgress}%`
                                }}
                            />
                        </div>
                    </section>

                    <div className='cart-layout'>
                        <section className='cart-items'>
                            {cartProducts.map((product) => {
                                const quantity = Number(cartItems[product._id])
                                const productTotal = Number(product.price) * quantity
                                
                                const imageName =
                                    Array.isArray(product.image)
                                        ? product.image[0]
                                        : product.image
                                
                                const productImage =
                                    imageMap[imageName] || imageName

                                return (
                                    <article
                                        className='cart-item'
                                        key={product._id}
                                    >
                                        <Link
                                            to={`/product/${product._id}`}
                                            className='cart-image-link'
                                        >
                                            <img
                                                src={productImage}
                                                alt={product.name}
                                                className='cart-item-image'
                                            />
                                        </Link>

                                        <div className='cart-item-info'>
                                            <div className='cart-product-heading'>
                                                <div>
                                                    <p className='cart-product-category'>
                                                        {product.category}
                                                    </p>

                                                    <Link
                                                        to={`/product/${product._id}`}
                                                    >
                                                        <h2>{product.name}</h2>
                                                    </Link>
                                                </div>

                                                <button
                                                    type='button'
                                                    className='remove-cart-item'
                                                    onClick={() => removeItemCompletely(product._id, product.name)}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <p className='cart-unit-price'>
                                                ${Number(product.price).toFixed(2)}{' '} each
                                            </p>

                                            <div className='cart-item-bottom'>
                                                <div className='cart-quantity'>
                                                    <button
                                                        type='button'
                                                        aria-label={`Decrease ${product.name} quantity`}
                                                        onClick={() => decreaseQuantity(product)}
                                                    >
                                                        -
                                                    </button>

                                                    <span>{quantity}</span>

                                                    <button
                                                        type='button'
                                                        aria-label={`Increase ${product.name} quantity`}
                                                        onClick={() => increaseQuantity(product)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p className='cart-subtotal'>
                                                    ${productTotal.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </section>

                        <aside className='cart-summary'>
                            <p className='summary-eyebrow'>
                                Order details
                            </p>

                            <h2>Cart Summary</h2>

                            <div className='summary-row'>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className='summary-row'>
                                <span>Shipping</span>
                                <span>
                                    {shippingCost === 0
                                        ? 'Free'
                                        : `$${shippingCost.toFixed(2)}`}
                                </span>
                            </div>

                            <div className='summary-divider'/>
                            <div className='summary-total'>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <p className='summary-tax-note'>
                                Taxes are calculated during checkout.
                            </p>

                            <Link
                                to='/place-order'
                                className='checkout-button'
                            >
                                Proceed to Checkout
                            </Link>

                            <Link 
                                to='/collection'
                                className='summary-shopping-link'
                            >
                                Continue shopping
                            </Link>

                            <div className='cart-security-note'>
                                <span>🔒</span>
                                <p>Secure checkout and protected payment information.</p>
                            </div>
                        </aside>
                    </div>
                </>
            )}
        </main>
    )
}

export default Cart