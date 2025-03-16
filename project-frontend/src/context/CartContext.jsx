/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"
import { getCartByUser, addToCart, removeCartItem, updateCartItemQuantity } from "../api/productApi"

const CartContext = createContext()

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0) // Add cart count for the header icon
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Create a reusable function to fetch cart that can be called from anywhere
  const fetchUserCart = useCallback(async (userId) => {
    if (!userId) return
    
    try {
      setLoading(true)
      const cartItems = await getCartByUser(userId)
      setCart(cartItems || [])
      
      // Calculate total count for the cart icon badge
      const count = cartItems.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error("Error fetching user cart:", error)
      setCart([])
      setCartCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch cart when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchUserCart(user.id)
    } else {
      setCart([])
      setCartCount(0)
    }
  }, [user, fetchUserCart])

  const addItemToCart = async (productId, quantity, productName, price, imageUrl, size, color) => {
    if (!user) {
      console.error("User must be logged in to add items to cart")
      throw new Error("User not authenticated")
    }

    try {
      setLoading(true)
      const newCartItem = await addToCart(user.id, productId, quantity, productName, price, imageUrl, size, color)
      
      // Fetch the entire cart again to ensure consistency
      await fetchUserCart(user.id)
      
      return newCartItem
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true)
      await removeCartItem(cartItemId)
      
      // Fetch the entire cart again to ensure consistency
      if (user && user.id) {
        await fetchUserCart(user.id)
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      setLoading(true)
      await updateCartItemQuantity(cartItemId, newQuantity)
      
      // Fetch the entire cart again to ensure consistency
      if (user && user.id) {
        await fetchUserCart(user.id)
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = () => {
    setCart([])
    setCartCount(0)
  }

  // Function to manually refresh the cart (can be called from any component)
  const refreshCart = () => {
    if (user && user.id) {
      fetchUserCart(user.id)
    }
  }

  const value = {
    cart,
    cartCount,
    loading,
    addItemToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}