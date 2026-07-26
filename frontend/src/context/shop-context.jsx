import { createContext, useEffect, useState } from 'react'
import API from '../services/api.js'

export const ShopContext = createContext(null)

const ShopContextProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [productError, setProductError] = useState('')
    const [cartLoading, setCartLoading] = useState(false)

    const loadProducts = async () => {
        try {
            setLoadingProducts(true)
            setProductError('')

            const response = await API.get('/products/list')

            if (response.data.success) {
                setProducts(
                    Array.isArray(response.data.products)
                        ? response.data.products
                        : []
                )
            } else {
                setProducts([])
                setProductError(
                    response.data.message ||
                    'Unable to load products.'
                )
            }
        } catch (error) {
            console.error('Unable to load products:', error)

            setProducts([])
            setProductError(
                error.response?.data?.message ||
                'Unable to connect to the product server.'
            )
        } finally {
            setLoadingProducts(false)
        }
    }

    const loadCart = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            setCartItems({})
            return
        }

        try {
            setCartLoading(true)

            const response = await API.get('/cart')

            if (response.data.success) {
                setCartItems(response.data.cartData || {})
            } else {
                setCartItems({})
            }
        } catch (error) {
            console.error('Unable to load cart:', error)
            setCartItems({})
        } finally {
            setCartLoading(false)
        }
    }

    const addToCart = async (
        itemId,
        size = '',
        colour = '',
        quantity = 1
    ) => {
        const token = localStorage.getItem('token')

        if (!token) {
            alert('Please log in before adding items to your cart.')
            return false
        }

        try {
            setCartLoading(true)

            const response = await API.post('/cart/add', {
                itemId,
                size,
                colour,
                quantity
            })

            if (response.data.success) {
                setCartItems(response.data.cartData || {})
                return true
            }

            alert(
                response.data.message ||
                'Unable to add product.'
            )

            return false
        } catch (error) {
            console.error('Unable to add product:', error)

            alert(
                error.response?.data?.message ||
                'Unable to add this product to your cart.'
            )

            return false
        } finally {
            setCartLoading(false)
        }
    }

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('token')

        if (!token) {
            return false
        }

        try {
            setCartLoading(true)

            const response = await API.post('/cart/remove', {
                itemId
            })

            if (response.data.success) {
                setCartItems(response.data.cartData || {})
                return true
            }

            return false
        } catch (error) {
            console.error('Unable to remove product:', error)
            return false
        } finally {
            setCartLoading(false)
        }
    }

    const clearCart = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            setCartItems({})
            return false
        }

        try {
            setCartLoading(true)

            const response = await API.delete('/cart/clear')

            if (response.data.success) {
                setCartItems({})
                return true
            }

            return false
        } catch (error) {
            console.error('Unable to clear cart:', error)
            return false
        } finally {
            setCartLoading(false)
        }
    }

    const getCartAmount = () => {
        return products.reduce((total, product) => {
            const quantity = Number(
                cartItems?.[product._id] || 0
            )

            return (
                total +
                Number(product.price || 0) * quantity
            )
        }, 0)
    }

    const getCartCount = () => {
        if (
            !cartItems ||
            typeof cartItems !== 'object' ||
            Array.isArray(cartItems)
        ) {
            return 0
        }

        return Object.values(cartItems).reduce(
            (total, quantity) => {
                const numberQuantity = Number(quantity)

                return total + (
                    Number.isNaN(numberQuantity)
                        ? 0
                        : numberQuantity
                )
            },
            0
        )
    }

    useEffect(() => {
        loadProducts()
    }, [])

    useEffect(() => {
        loadCart()
    }, [])

    useEffect(() => {
        const handleAuthChange = () => {
            loadCart()
        }

        window.addEventListener(
            'auth-change',
            handleAuthChange
        )

        return () => {
            window.removeEventListener(
                'auth-change',
                handleAuthChange
            )
        }
    }, [])

    const value = {
        products,
        cartItems,
        loadingProducts,
        productError,
        cartLoading,
        loadProducts,
        loadCart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartAmount,
        getCartCount
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider