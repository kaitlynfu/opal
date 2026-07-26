import './navbar.css'
import { useEffect, useRef, useState, useContext, useMemo } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets.js'
import { Search, User, Heart, ShoppingBag } from 'lucide-react'
import { imageMap } from '../../assets/imageMap.js'
import { ShopContext } from '../../context/shop-context.jsx'
import { WishlistContext } from '../../context/wishlist-context.jsx'

const Navbar = () => {
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const searchRef = useRef(null)
    const searchInputRef = useRef(null)

    const shopContext = useContext(ShopContext)
    const wishlistContext = useContext(WishlistContext)
    const products = shopContext?.products || []
    const wishlistCount = wishlistContext?.getWishlistCount?.() || 0

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('token'))
    )

    const [showDropdown, setShowDropdown] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const updateLoginState = () => {
            setIsLoggedIn(Boolean(localStorage.getItem('token')))
        }

        window.addEventListener('auth-change', updateLoginState)
        window.addEventListener('storage', updateLoginState)

        return () => {
            window.removeEventListener('auth-change', updateLoginState)
            window.removeEventListener('storage', updateLoginState)
        }
    }, [])

    useEffect(() => {
        const closeDropdown = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }

            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) 
            ) {
                setShowSearch(false)
            }
        }

        document.addEventListener('mousedown', closeDropdown)

        return () => {
            document.removeEventListener('mousedown', closeDropdown)
        }
    }, [])

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowSearch(false)
                setShowDropdown(false)
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    useEffect(() => {
        if (showSearch) {
            searchInputRef.current?.focus()
        }
    }, [showSearch])

    const searchResults = useMemo(() => {
        const cleanedSearch = searchTerm.trim().toLowerCase()

        if (!cleanedSearch) {
            return []
        }

        return products.filter((product) => {
            const name = product.name?.toLowerCase() || ''
            const category = product.category?.toLowerCase() || ''
            const description = product.description?.toLowerCase() || ''
            const colours = Array.isArray(product.colours)
                ? product.colours.join(' ').toLowerCase()
                : ''
            
            return (
                name.includes(cleanedSearch) ||
                category.includes(cleanedSearch) ||
                description.includes(cleanedSearch) ||
                colours.includes(cleanedSearch)
            )
        })
        .slice(0, 5)
    }, [products, searchTerm])

    const getProductImage = (product) => {
        const imageName = Array.isArray(product.image)
            ? product.image[0]
            : product.image

        return imageMap[imageName] || imageName
    }

    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        setShowDropdown((previousValue) => !previousValue)
    }

    const handleSearchClick = () => {
        navigate('/search')
    }

    const closeSearch = () => {
        setShowSearch(false)
        setSearchTerm('')
    }

    const handleProductClick = (productId) => {
        closeSearch()
        navigate(`/product/${productId}`)
    }

    const handleViewAllResults = () => {
        const cleanedSearch = searchTerm.trim()

        if (!cleanedSearch) {
            navigate('/search')
        } else {
            navigate(`/search?q=${encodeURIComponent(cleanedSearch)}`)
        }
        
        closeSearch()
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        handleViewAllResults()
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setShowDropdown(false)

        window.dispatchEvent(new Event('auth-change'))

        navigate('/')
    }

    return (
        <nav className='navbar'>
            <Link to='/' className='navbar-logo-link'>
                <img
                    src={assets.opal_logo}
                    alt='Opal Clothing'
                    className='navbar-logo'
                />
            </Link>

            <ul className='navbar-links'>
                <li>
                    <NavLink
                        to='/'
                        end
                        className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                    >
                        Home
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/collection'
                        className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                    >
                        Collection
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/about'
                        className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                    >
                        About Us
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/contact'
                        className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                    >
                        Contact
                    </NavLink>
                </li>
            </ul>

            <div className='navbar-actions'>
                <div className='navbar-search-container' ref={searchRef}>
                    <button
                        type='button'
                        className='navbar-icon-button'
                        aria-label='Search'
                        aria-expanded={showSearch}
                        onClick={handleSearchClick}
                    >
                        <Search size={25} />
                    </button>

                    {showSearch && (
                        <div className='navbar-search-panel'>
                            ...
                        </div>
                    )}
                </div>

                <div
                    className='profile-container'
                    ref={dropdownRef}
                >
                    <button
                        type='button'
                        className='navbar-icon-button'
                        onClick={handleProfileClick}
                        aria-label='Profile'
                    >
                        <User size={25} />
                    </button>

                    {isLoggedIn && showDropdown && (
                        <div className='profile-dropdown'>
                            <p className='profile-dropdown-title'>
                                My Account
                            </p>

                            <Link
                                to='/profile'
                                onClick={() => setShowDropdown(false)}
                            >
                                Profile
                            </Link>

                            <Link
                                to='/orders'
                                onClick={() => setShowDropdown(false)}
                            >
                                My Orders
                            </Link>

                            <button
                                type='button'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <Link 
                    to='/wishlist'
                    className='navbar-wishlist-link'
                    aria-label='Wishlist'
                >
                    <Heart size={25} />
                    {wishlistCount > 0 && (
                        <span className='navbar-wishlist-count'>
                            {wishlistCount}
                        </span>
                    )}
                </Link>

                <Link
                    to='/cart'
                    className='cart-link'
                    aria-label='Cart'
                >
                    <ShoppingBag size={25} />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar