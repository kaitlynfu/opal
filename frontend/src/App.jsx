import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'

import Home from './pages/home.jsx'
import Collection from './pages/collection-page/collection.jsx'
import About from './pages/about-page/about.jsx'
import Contact from './pages/contact-page/contact.jsx'
import Product from './pages/product-page/product.jsx'
import Cart from './pages/cart-page/cart.jsx'
import Login from './pages/login-page/login'
import PlaceOrder from './pages/place-order-page/place-order.jsx'
import Orders from './pages/orders-page/orders.jsx'
import Profile from './pages/profile-page/profile.jsx'
import Wishlist from './pages/wishlist-page/wishlist.jsx'
import Search from './pages/search-page/search.jsx'

const App = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/collection' element={<Collection />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/product/:productId' element={<Product />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/login' element={<Login />} />
                <Route path='/place-order' element={<PlaceOrder />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/search' element={<Search />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App