import './place-order.css'
import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'
import { imageMap } from '../../assets/imageMap.js'

const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'New Zealand',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: ''
}

const PlaceOrder = () => {
    const navigate = useNavigate()
    const shopContext = useContext(ShopContext)
    const toastContext = useContext(ToastContext)

    const products = Array.isArray(shopContext.products) 
        ? shopContext.products
        : []
    
    const cartItems = shopContext?.cartItems || []
    const clearCart = shopContext?.clearCart

    const [formData, setFormData] = useState(initialFormData)
    const [shippingMethod, setShippingMethod] = useState('standard')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [placingOrder, setPlacingOrder] = useState(false)

    const checkoutItems = useMemo(() => {
        if (Array.isArray(cartItems)) {
            return cartItems.map((cartItem) => {
                const productId =
                    cartItem.productId ||
                    cartItem.product?._id ||
                    cartItem._id

                const product = 
                    cartItem.product ||
                    products.find((item) => String(item._id) === String(productId))
                
                if (!product) {
                    return null
                }

                const quantity = Number(cartItem.quantity || cartItem.qty || 1)

                return {
                    cartId: cartItem.cartId || cartItem._id || `${product._id}-${cartItem.size || ''}-${cartItem.colour || ''}`,
                    product,
                    quantity,
                    size: cartItem.size || cartItem.selectedSize || '',
                    colour: cartItem.colour || cartItem.color || cartItem.selectedColour || ''
                }
            })
            .filter(Boolean)
        }

        if (cartItems && typeof cartItems === 'object') {
            return Object.entries(cartItems).flatMap(([productId, cartValue]) => {
                const product = products.find((item) => String(item._id) === String(productId))

                if (!product) {
                    return []
                }

                if (typeof cartValue === 'number') {
                    if (cartValue <= 0) {
                        return []
                    }

                    return [{
                        cartId: productId,
                        product,
                        quantity: cartValue,
                        size: '',
                        colour: ''
                    }]
                }

                if (cartValue && typeof cartValue === 'object') {
                    return Object.entries(cartValue).map(([variantKey, quantity]) => {
                        const numericQuantity = Number(quantity)

                        if (numericQuantity <= 0) {
                            return null
                        }

                        const [size = '', colour = ''] = variantKey.split('|')

                        return {
                            cartId: `${productId}-${variantKey}`,
                            product,
                            quantity: numericQuantity,
                            size,
                            colour
                        }
                    })
                    .filter(Boolean)
                }
                return []
            })
        }
        return []
    }, [cartItems, products])

    const calculatedSubtotal = useMemo(() => {
        return checkoutItems.reduce((total, item) => {
            return (
                total + Number(item.product.price || 0) * Number(item.quantity || 0)
            )
        }, 0)
    }, [checkoutItems])

    const subtotal = calculatedSubtotal

    const shippingCost = 
        shippingMethod === 'express' 
            ? 12 
            : subtotal >= 100 
                ? 0 
                : 8
    
    const total = subtotal + shippingCost

    const getProductImage = (product) => {
        const productImage = Array.isArray(product?.image)
            ? product.image[0]
            : product?.image
        
        return (
            imageMap[productImage] || productImage || ''
        )
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleCardNumberChange = (e) => {
        const numbersOnly = e.target.value.replace(/\D/g, '')
        const formattedNumber = numbersOnly.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

        setFormData((currentData) => ({
            ...currentData,
            cardNumber: formattedNumber
        }))
    }

    const handleExpiryChange = (e) => {
        const numbersOnly = e.target.value.replace(/\D/g, '')

        let formattedExpiry = numbersOnly.slice(0, 4)

        if (formattedExpiry.length > 2) {
            formattedExpiry = `${formattedExpiry.slice(0, 2)}/${formattedExpiry.slice(2)}`
        }

        setFormData((currentData) => ({
            ...currentData,
            expiryDate: formattedExpiry
        }))
    }

    const validateDeliveryDetails = () => {
        const requiredFields = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'street',
            'city',
            'region',
            'postalCode',
            'country'
        ]

        return requiredFields.every((field) => formData[field].trim() !== '')
    }

    const validateCardDetails = () => {
        if (paymentMethod !== 'card') {
            return true
        }

        const cardNumber = formData.cardNumber.replace(/\s/g, '')

        return (
            formData.cardName.trim() !== '' &&
            cardNumber.length === 16 &&
            formData.expiryDate.length === 5 &&
            formData.securityCode.length >= 3
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')

        if (!token) {
            toastContext?.showToast?.(
                'Please log in before placing your order.',
                'info'
            )

            navigate('/login')
            return
        }

        if (checkoutItems.length === 0) {
            toastContext?.showToast?.(
                'Your cart is empty.',
                'error'
            )

            return
        }

        if (!validateDeliveryDetails()) {
            toastContext?.showToast?.(
                'Please complete all required delivery fields',
                'error'
            )
            
            return
        }

        if (!validateCardDetails()) {
            toastContext?.showToast?.(
                'Please enter valid card details',
                'error'
            )

            return
        }

        if (!acceptTerms) {
            toastContext?.showToast?.(
                'Please accept the terms and conditions.',
                'error'
            )

            return
        }

        const orderData = {
            items: checkoutItems.map((item) => ({
                productId: item.product_id,
                name: item.product.name,
                price: Number(item.product.price),
                quantity: item.quantity,
                size: item.size,
                colour: item.colour
            })),

            deliveryInformation: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                street: formData.street,
                apartment: formData.apartment,
                city: formData.city,
                region: formData.region,
                postalCode: formData.postalCode,
                country: formData.country
            },

            shippingMethod,
            paymentMethod,
            subtotal,
            shippingCost,
            total
        }

        try {
            setPlacingOrder(true)

            console.log('Order submitted:', orderData)

            await new Promise((resolve) => setTimeout(resolve, 900))

            if (typeof clearCart === 'function') {
                await clearCart()
            }

            toastContext?.showToast?.(
                'Your order has been placed successfully.',
                'success'
            )

            navigate('/orders')
        } catch (error) {
            console.error('Place order error:', error)

            toastContext?.showToast?.(
                error?.response?.data?.message ||
                error?.message ||
                'Unable to place your order.',
                'error'
            )
        } finally {
            setPlacingOrder(false)
        }
    }

    if (checkoutItems.length === 0) {
        return (
            <main className='place-order-page'>
                <div className='checkout-empty'>
                    <span className='checkout-empty-icon'>
                        ◇
                    </span>

                    <p className='checkout-eyebrow'>Your bag</p>
                    <h1>Your cart is empty</h1>
                    <p>Add some Opal pieces before continuing to checkout.</p>

                    <Link to='/collection'>Continue shopping</Link>
                </div>
            </main>
        )
    }

    return (
        <main className='place-order-page'>
            <header className='checkout-heading'>
                <p className='checkout-eyebrow'>Secure checkout</p>
                <h1>Complete your order</h1>
                <div className='checkout-progress'>
                    <span className='complete'>
                        1. Cart
                    </span>

                    <span className='active'>
                        2. Checkout
                    </span>

                    <span>3. Confirmation</span>
                </div>
            </header>

            <form
                className='checkout-layout'
                onSubmit={handleSubmit}
            >
                <div className='checkout-main'>
                    <section className='checkout-section'>
                        <div className='checkout-section-heading'>
                            <span>01</span>
                            <div>
                                <h2>Contact Information</h2>
                                <p>We will send your order confirmation and updates here.</p>
                            </div>
                        </div>

                        <div className='delivery-form'>
                            <div className='form-row'>
                                <label className='checkout-field'>
                                    <span>First name *</span>
                                    <input
                                        input='text'
                                        name='firstName'
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        autoComplete='given-name'
                                        required
                                    />
                                </label>

                                <label className='checkout-field'>
                                    <span>Last name *</span>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        autoComplete='family-name'
                                        required
                                    />
                                </label>
                            </div>

                            <div className='form-row'>
                                <label className='checkout-field'>
                                    <span>Email address *</span>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        autoComplete='email'
                                        required
                                    />
                                </label>

                                <label className='checkout-field'>
                                    <span>Phone number *</span>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        autoComplete='tel'
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className='checkout-section'>
                        <div className='checkout-section-heading'>
                            <span>02</span>
                            <div>
                                <h2>Delivery address</h2>
                                <p>Enter the address where you would like your order delivered.</p>
                            </div>
                        </div>

                        <div className='delivery-form'>
                            <label className='checkout-field'>
                                <span>Street address *</span>
                                <input
                                    type='text'
                                    name='street'
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    autoComplete='street-address'
                                    required
                                />
                            </label>

                            <label className='checkout-field'>
                                <span>Apartment, unit or building</span>
                                <input 
                                    type='text'
                                    name='apartment'
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <div className='form-row'>
                                <label className='checkout-field'>
                                    <span>City *</span>
                                    <input 
                                        type='text'
                                        name='city'
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        autoComplete='address-level2'
                                        required
                                    />
                                </label>

                                <label className='checkout-field'>
                                    <span>Region *</span>
                                    <input 
                                        type='text'
                                        name='region'
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        autoComplete='address-level1'
                                        placeholder='e.g. Auckland'
                                        required
                                    />
                                </label>
                            </div>

                            <div className='form-row'>
                                <label className='checkout-field'>
                                    <span>Postal code *</span>
                                    <input 
                                        type='text'
                                        name='postalCode'
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        autoComplete='postal-code'
                                        required
                                    />
                                </label>

                                <label className='checkout-field'>
                                    <span>Country *</span>
                                    <select
                                        name='country'
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        autoComplete='country-name'
                                        required
                                    >
                                        <option value='New Zealand'>
                                            New Zealand
                                        </option>

                                        <option value='Australia'>
                                            Australia
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className='checkout-section'>
                        <div className='checkout-section-heading'>
                            <span>03</span>
                            <div>
                                <h2>Shipping method</h2>
                                <p>Select how quickly you would like your order.</p>
                            </div>
                        </div>

                        <div className='shipping-options'>
                            <label className={shippingMethod === 'standard' ? 'shipping-option active' : 'shipping-option'}>
                                <input
                                    type='radio'
                                    name='shippingMethod'
                                    value='standard'
                                    checked={shippingMethod === 'standard'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <span className='custom-radio'/>
                                <span className='shipping-option-text'>
                                    <strong>Standard delivery</strong>
                                    <small>2-5 working days</small>
                                </span>

                                <strong>{subtotal >= 100 ? 'Free' : '$8.00'}</strong>
                            </label>

                            <label
                                className={shippingMethod ===
                                    'express'
                                        ? 'shipping-option active'
                                        : 'shipping-option'
                                }
                            >
                                <input
                                    type='radio'
                                    name='shippingMethod'
                                    value='express'
                                    checked={shippingMethod === 'express'}
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                />

                                <span className='custom-radio'/>
                                <span className='shipping-option-text'>
                                    <strong>Express delivery</strong>
                                    <small>1-2 working days</small>
                                </span>
                                <strong>$12.00</strong>
                            </label>
                        </div>
                    </section>

                    <section className='checkout-section'>
                        <div className='checkout-section-heading'>
                            <span>04</span>
                            <div>
                                <h2>Payment</h2>
                                <p>Your payment information is encrypted and secure.</p>
                            </div>
                        </div>

                        <div className='payment-options'>
                            <label
                                className={
                                    paymentMethod === 'card'
                                        ? 'payment-option active'
                                        : 'payment-option'
                                }
                            >
                                <input
                                    type='radio'
                                    name='paymentMethod'
                                    value='card'
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <span className='custom-radio'/>
                                <span>Credit or debit card</span>
                                <span className='payment-label'>
                                    Visa · Mastercard
                                </span>
                            </label>

                            <label
                                className={
                                    paymentMethod === 'paypal'
                                        ? 'payment-option active'
                                        : 'payment-option'
                                }
                            >
                                <input 
                                    type='radio'
                                    name='paymentMethod'
                                    value='paypal'
                                    checked={paymentMethod === 'paypal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <span className='custom-radio' />
                                <span>PayPal</span>
                            </label>

                            <label
                                className={
                                    paymentMethod === 'apple-pay'
                                        ? 'payment-option active'
                                        : 'payment-option'
                                }
                            >
                                <input
                                    type='radio'
                                    name='paymentMethod'
                                    value='apple-pay'
                                    checked={paymentMethod === 'apple-pay'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <span className='custom-radio'/>
                                <span>Apple Pay</span>
                            </label>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className='card-fields'>
                                <label className='checkout-field'>
                                    <span>Name on card *</span>
                                    <input 
                                        type='text'
                                        name='cardName'
                                        value={formData.cardName}
                                        onChange={handleInputChange}
                                        autoComplete='cc-name'
                                        required
                                    />
                                </label>

                                <label className='checkout-field'>
                                    <span>Card number *</span>
                                    <input 
                                        type='text'
                                        name='cardNumber'
                                        value={formData.cardNumber}
                                        onChange={handleCardNumberChange}
                                        inputMode='numeric'
                                        autoComplete='cc-number'
                                        placeholder='0000 0000 0000 0000'
                                        required
                                    />
                                </label>

                                <div className='form-row'>
                                    <label className='checkout-field'>
                                        <span>Expiry date *</span>

                                        <input 
                                            type='text'
                                            name='expiryDate'
                                            value={formData.expiryDate}
                                            onChange={handleExpiryChange}
                                            inputMode='numeric'
                                            autoComplete='cc-exp'
                                            placeholder='MM/YY'
                                            required
                                        />
                                    </label>

                                    <label className='checkout-field'>
                                        <span>Security code *</span>
                                        <input 
                                            type='password'
                                            name='securityCode'
                                            value={formData.securityCode}
                                            onChange={handleInputChange}
                                            inputMode='numeric'
                                            autoComplete='cc-csc'
                                            maxLength='4'
                                            placeholder='CVV'
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <aside className='order-summary'>
                    <div className='order-summary-header'>
                        <div>
                            <p className='checkout-eyebrow'>Your order</p>
                            <h2>Order summary</h2>
                        </div>

                        <Link to='/cart'>Edit cart</Link>
                    </div>

                    <div className='checkout-products'>
                        {checkoutItems.map((item) => {
                            const image = getProductImage(item.product)

                            return (
                                <article className='checkout-product' key={item.cartId}>
                                    <div className='checkout-product-image'>
                                        {image ? (
                                            <img src={image} alt={item.product.name}/>
                                        ) : (
                                            <span>No image</span>
                                        )}

                                        <span className='checkout-product-quantity'>{item.quantity}</span>
                                    </div>

                                    <div className='checkout-product-details'>
                                        <h3>{item.product.name}</h3>

                                        {(item.size || item.colour) && (
                                            <p>
                                                {item.size && `Size: ${item.size}`}
                                                {item.size && item.colour && ' · '}
                                                {item.colour && `Colour: ${item.colour}`}
                                            </p>
                                        )}

                                        <p>
                                            Quantity:{' '}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <strong>${(Number(item.product.price || 0) * item.quantity).toFixed(2)}</strong>
                                </article>
                            )
                        })}
                    </div>

                    <div className='summary-calculations'>
                        <div className='summary-row'>
                            <span>Subtotal</span>
                            <strong>${subtotal.toFixed(2)}</strong>
                        </div>

                        <div className='summary-row'>
                            <span>Shipping</span>
                            <strong>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</strong>
                        </div>

                        <div className='summary-row summary-total'>
                            <span>Total</span>
                            <div>
                                <small>NZD</small>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <label className='terms-checkbox'>
                        <input
                            type='checkbox'
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.value)}
                        />

                        <span>I agree to the terms and conditions and acknowledge the privacy policy.</span>
                    </label>

                    <button
                        type='submit'
                        className='place-order-btn'
                        disabled={placingOrder}
                    >
                        {placingOrder
                            ? 'Placing order...'
                            : `Place order · $${total.toFixed(2)}`}
                    </button>

                    <div className='checkout-security'>
                        <p>Secure and encrypted checkout</p>
                        <div>
                            <span>Visa</span>
                            <span>Mastercard</span>
                            <span>Apple Pay</span>
                        </div>
                    </div>
                </aside>
            </form>
        </main>
    )
}

export default PlaceOrder