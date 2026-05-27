import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google' // Added import
import './index.css'
import App from './App.tsx'
import { CartProvider } from "@/features/cart/context/CartContext";
import { WishlistProvider } from './features/wishlist/context/WishlistContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrapped at the very top level so authentication status is available globally */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)