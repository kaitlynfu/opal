import './orders.css'
import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'
import { imageMap } from '../../assets/imageMap.js'

const Orders = () => {
    const navigate = useNavigate()
    const shopContext = useContext(ShopContext) || {}
    const toastContext = useContext(ToastContext)

    const products = Array.isArray(shopContext.products)
        ? shopContext.products
        : []

    const addToCart = shopContext.addToCart
    const [expandedOrder, setExpandedOrder] = useState(null)

    const orders = useMemo(() => {
        const firstProduct = products[0]
        const secondProduct = products[1]
        const thirdProduct = products[2]

        if (!firstProduct) {
            return []
        }

        return [
            {
                id: 'OPL-10452',
                date: '21 July 2026',
                status: 'Processing',
                paymentStatus: 'Paid',
                shippingMethod: 'Standard Delivery',
                deliveryEstimate: '24–27 July 2026',
                subtotal: 120,
                shipping: 0,
                total: 120,
                address: {
                    name: 'John',
                    street: '123 Example Street',
                    city: 'Auckland',
                    postalCode: '1234',
                    country: 'New Zealand'
                },
                items: [
                    {
                        productId: firstProduct._id,
                        name: firstProduct.name,
                        price: Number(firstProduct.price || 0),
                        image: Array.isArray(firstProduct.image)
                            ? firstProduct.image[0]
                            : firstProduct.image,
                        quantity: 1,
                        size: firstProduct.sizes?.[0] || 'M',
                        colour:
                            firstProduct.colours?.[0] ||
                            firstProduct.colors?.[0] ||
                            'Beige'
                    },
                    ...(secondProduct
                        ? [
                            {
                                productId: secondProduct._id,
                                name: secondProduct.name,
                                price: Number(secondProduct.price || 0),
                                image: Array.isArray(secondProduct.image)
                                    ? secondProduct.image[0]
                                    : secondProduct.image,
                                quantity: 1,
                                size: secondProduct.sizes?.[0] || 'S',
                                colour:
                                    secondProduct.colours?.[0] ||
                                    secondProduct.colors?.[0] ||
                                    'Black'
                            }
                        ]
                        : [])
                ]
            },
            ...(thirdProduct
                ? [
                    {
                        id: 'OPL-10381',
                        date: '10 July 2026',
                        status: 'Delivered',
                        paymentStatus: 'Paid',
                        shippingMethod: 'Express Delivery',
                        deliveryEstimate: 'Delivered 12 July 2026',
                        subtotal: Number(thirdProduct.price || 0),
                        shipping: 12,
                        total:
                            Number(thirdProduct.price || 0) + 12,
                        address: {
                            name: 'John',
                            street: '123 Example Street',
                            city: 'Auckland',
                            postalCode: '1234',
                            country: 'New Zealand'
                        },
                        items: [
                            {
                                productId: thirdProduct._id,
                                name: thirdProduct.name,
                                price: Number(thirdProduct.price || 0),
                                image: Array.isArray(thirdProduct.image)
                                    ? thirdProduct.image[0]
                                    : thirdProduct.image,
                                quantity: 1,
                                size: thirdProduct.sizes?.[0] || 'M',
                                colour:
                                    thirdProduct.colours?.[0] ||
                                    thirdProduct.colors?.[0] ||
                                    'Cream'
                            }
                        ]
                    }
                ]
                : [])
        ]
    }, [products])

    const getProductImage = (image) => {
        return imageMap[image] || image || ''
    }

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '-')
    }

    const getTimelineStep = (status) => {
        const statusOrder = {
            Processing: 2,
            Preparing: 3,
            Shipped: 4,
            Delivered: 5,
            Cancelled: 0
        }

        return statusOrder[status] || 1
    }

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder((currentOrder) =>
            currentOrder === orderId
                ? null
                : orderId
        )
    }

    const handleTrackOrder = (order) => {
        if (order.status === 'Delivered') {
            toastContext?.showToast?.(
                'This order has already been delivered.',
                'info'
            )

            return
        }

        toastContext?.showToast?.(
            `Tracking information for order ${order.id} will be available soon.`,
            'info'
        )
    }

    const handleBuyAgain = async (order) => {
        if (typeof addToCart !== 'function') {
            toastContext?.showToast?.(
                'Cart functionality is currently unavailable.',
                'error'
            )

            return
        }

        try {
            for (const item of order.items) {
                await addToCart(item.productId, item.size, item.colour, item.quantity)
            }

            toastContext?.showToast?.(
                'Order items were added to your cart.',
                'success'
            )

            navigate('/cart')
        } catch (error) {
            console.error('Buy again error:', error)

            toastContext?.showToast?.(
                error?.message ||
                'Unable to add these items to your cart.',
                'error'
            )
        }
    }

    const handleDownloadReceipt = (order) => {
        const receiptLines = [
            `OPAL CLOTHING`,
            `Order receipt`,
            ``,
            `Order number: ${order.id}`,
            `Order date: ${order.date}`,
            `Order status: ${order.status}`,
            `Payment status: ${order.paymentStatus}`,
            ``,
            `Items:`,
            ...order.items.map((item) => `${item.name} | Size: ${item.size} | Colour: ${item.colour} | Quantity: ${item.quantity} | $${(item.price * item.quantity).toFixed(2)}`),
            ``,
            `Subtotal: $${order.subtotal.toFixed(2)}`,
            `Shipping: ${order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}`,
            `Total: $${order.total.toFixed(2)}`
        ]

        const receiptBlob = new Blob(
            [receiptLines.join('\n')],
            {
                type: 'text/plain'
            }
        )

        const receiptUrl = URL.createObjectURL(receiptBlob)
        const downloadLink = document.createElement('a')

        downloadLink.href = receiptUrl
        downloadLink.download = `${order.id}-receipt.txt`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.remove()

        URL.revokeObjectURL(receiptUrl)

        toastContext?.showToast?.(
            'Your receipt has been downloaded.',
            'success'
        )
    }

    if (orders.length === 0) {
        return (
            <main className='orders-page'>
                <section className='orders-empty'>
                    <div className='orders-empty-icon'>
                        ◇
                    </div>

                    <p className='orders-eyebrow'>Your orders</p>
                    <h1>No orders yet</h1>
                    <p>Once you place an order, you will be able to view its status, products and delivery information here.</p>

                    <Link to='/collection'>Shop the collection</Link>
                </section>
            </main>
        )
    }

    return (
        <main className='orders-page'>
            <header className='orders-header'>
                <div>
                    <p className='orders-eyebrow'>Your account</p>
                    <h1>My orders</h1>
                    <p className='orders-introduction'>Review your purchases, track deliveries and buy your favourite Opal pieces again.</p>
                </div>

                <Link
                    to='/collection'
                    className='orders-shop-link'
                >
                    Continue shopping
                </Link>
            </header>

            <section className='orders-list'>
                {orders.map((order) => {
                    const currentTimelineStep = getTimelineStep(order.status)
                    const isExpanded = expandedOrder === order.id

                    return (
                        <article
                            className='order-card'
                            key={order.id}
                        >
                            <div className='order-card-header'>
                                <div className='order-number'>
                                    <p>Order number</p>
                                    <h2>{order.id}</h2>
                                </div>

                                <div className='order-header-detail'>
                                    <p>Placed</p>
                                    <strong>
                                        {order.date}
                                    </strong>
                                </div>

                                <div className='order-header-detail'>
                                    <p>Total</p>
                                    <strong>
                                        ${order.total.toFixed(2)}
                                    </strong>
                                </div>

                                <span
                                    className={`order-status ${getStatusClass(order.status)}`}
                                >
                                    <span />
                                    {order.status}
                                </span>
                            </div>

                            <div className='order-products'>
                                {order.items.map(
                                    (item, index) => {
                                        const image = getProductImage(item.image)

                                        return (
                                            <div
                                                className='order-product'
                                                key={`${order.id}-${item.productId}-${index}`}
                                            >
                                                <div className='order-product-image'>
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <span>No image</span>
                                                    )}
                                                </div>

                                                <div className='order-product-info'>
                                                    <h3>
                                                        {item.name}
                                                    </h3>

                                                    <p>
                                                        Size:{' '}
                                                        {item.size}
                                                    </p>

                                                    <p>
                                                        Colour:{' '}
                                                        {item.colour}
                                                    </p>

                                                    <p>
                                                        Quantity:{' '}
                                                        {item.quantity}
                                                    </p>
                                                </div>

                                                <strong className='order-product-price'>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </strong>
                                            </div>
                                        )
                                    }
                                )}
                            </div>

                            {order.status !==
                                'Cancelled' && (
                                <div className='order-timeline'>
                                    {[
                                        'Order placed',
                                        'Payment confirmed',
                                        'Preparing',
                                        'Shipped',
                                        'Delivered'
                                    ].map(
                                        (
                                            step,
                                            index) => {
                                            const stepNumber = index + 1
                                            const isComplete = stepNumber < currentTimelineStep
                                            const isCurrent = stepNumber === currentTimelineStep

                                            return (
                                                <div
                                                    className={`timeline-step ${
                                                        isComplete
                                                            ? 'complete'
                                                            : ''
                                                    } ${
                                                        isCurrent
                                                            ? 'current'
                                                            : ''
                                                    }`}
                                                    key={step}
                                                >
                                                    <div className='timeline-marker'>
                                                        {isComplete
                                                            ? '✓'
                                                            : stepNumber}
                                                    </div>

                                                    <p>
                                                        {step}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            )}

                            <div className='order-delivery-summary'>
                                <div>
                                    <p>Delivery status</p>

                                    <strong>
                                        {order.deliveryEstimate}
                                    </strong>
                                </div>

                                <div>
                                    <p>Shipping method</p>

                                    <strong>
                                        {order.shippingMethod}
                                    </strong>
                                </div>

                                <div>
                                    <p>Payment</p>

                                    <strong>
                                        {order.paymentStatus}
                                    </strong>
                                </div>
                            </div>

                            <div className='order-card-actions'>
                                <button
                                    type='button'
                                    className='order-primary-button'
                                    onClick={() => handleTrackOrder(order)}
                                >
                                    Track order
                                </button>

                                <button
                                    type='button'
                                    className='order-secondary-button'
                                    onClick={() => handleBuyAgain(order)}
                                >
                                    Buy again
                                </button>

                                <button
                                    type='button'
                                    className='order-text-button'
                                    onClick={() => handleDownloadReceipt(order)}
                                >
                                    Download receipt
                                </button>

                                <button
                                    type='button'
                                    className='order-text-button details-button'
                                    onClick={() => toggleOrderDetails(order.id)}
                                >
                                    {isExpanded
                                        ? 'Hide details'
                                        : 'View details'}

                                    <span>
                                        {isExpanded
                                            ? '−'
                                            : '+'}
                                    </span>
                                </button>
                            </div>

                            {isExpanded && (
                                <div className='order-expanded-details'>
                                    <div>
                                        <p>Delivery address</p>

                                        <strong>
                                            {order.address.name}
                                        </strong>

                                        <span>
                                            {order.address.street}
                                        </span>

                                        <span>
                                            {order.address.city}
                                            ,{' '}
                                            {order.address.postalCode}
                                        </span>

                                        <span>
                                            {order.address.country}
                                        </span>
                                    </div>

                                    <div className='order-price-summary'>
                                        <div>
                                            <span>Subtotal</span>

                                            <strong>
                                                ${order.subtotal.toFixed(2)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Shipping</span>

                                            <strong>
                                                {order.shipping === 0
                                                    ? 'Free'
                                                    : `$${order.shipping.toFixed(2)}`}
                                            </strong>
                                        </div>

                                        <div className='order-price-total'>
                                            <span>Total</span>

                                            <strong>
                                                ${order.total.toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </article>
                    )
                })}
            </section>
        </main>
    )
}

export default Orders