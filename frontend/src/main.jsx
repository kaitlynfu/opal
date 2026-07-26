import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/shop-context.jsx'
import WishlistContextProvider from './context/wishlist-context.jsx'
import ToastContextProvider from './context/toast-context.jsx'
import App from './App.jsx'
import './index.css'
import './context/toast.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopContextProvider>
        <WishlistContextProvider>
          <ToastContextProvider>
            <App />
          </ToastContextProvider>
        </WishlistContextProvider>
      </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)