/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */


import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { getCartByUser, addToCart, removeCartItem, updateCartItemQuantity } from "../api/productApi"

const CartContext = createContext()

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.id) {
      fetchUserCart(user.id)
    } else {
      setCart([])
    }
  }, [user])

  const fetchUserCart = async (userId) => {
    try {
      const cartItems = await getCartByUser(userId)
      setCart(cartItems)
    } catch (error) {
      console.error("Error fetching user cart:", error)
      setCart([])
    }
  }

  const addItemToCart = async (productId, quantity, productName, price, imageUrl, size, color) => {
    if (!user) {
      console.error("User must be logged in to add items to cart")
      throw new Error("User not authenticated")
    }

    try {
      const newCartItem = await addToCart(user.id, productId, quantity, productName, price, imageUrl, size, color)
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.productId === productId && item.size === size && item.color === color,
        )
        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart]
          updatedCart[existingItemIndex] = newCartItem
          return updatedCart
        } else {
          return [...prevCart, newCartItem]
        }
      })
      return newCartItem
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId)
      setCart((prevCart) => prevCart.filter((item) => item._id !== cartItemId))
    } catch (error) {
      console.error("Error removing item from cart:", error)
    }
  }

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const updatedItem = await updateCartItemQuantity(cartItemId, newQuantity)
      setCart((prevCart) => prevCart.map((item) => (item._id === cartItemId ? updatedItem : item)))
    } catch (error) {
      console.error("Error updating cart item quantity:", error)
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const value = {
    cart,
    addItemToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

