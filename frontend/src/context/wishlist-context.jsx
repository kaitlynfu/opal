import { createContext, useEffect, useState } from 'react'

export const WishlistContext = createContext(null)

const WishlistContextProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem('wishlist')

            return savedWishlist 
                ? JSON.parse(savedWishlist) 
                : []
        } catch (error) {
            console.error('Could not load wishlist:', error)
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    }, [wishlistItems])

    const isInWishlist = (productId) => {
        return wishlistItems.includes(productId)
    }

    const addToWishlist = (productId) => {
        setWishlistItems((currentItems) => {
            if (currentItems.includes(productId)) {
                return currentItems
            }

            return [...currentItems, productId]
        })
    }

    const removeFromWishlist = (productId) => {
        setWishlistItems((currentItems) =>
            currentItems.filter((id) => id !== productId)
        )
    }

    const toggleWishlist = (productId) => {
        setWishlistItems((currentItems) => {
            if (currentItems.includes(productId)) {
                return currentItems.filter((id) => id !== productId)
            }

            return [...currentItems, productId]
        })
    }

    const clearWishlist = () => {
        setWishlistItems([])
    }

    const getWishlistCount = () => {
        return wishlistItems.length
    }

    const contextValue = {
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        getWishlistCount
    }

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    )
}

export default WishlistContextProvider