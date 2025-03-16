// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { getCartByUser } from "../productApi"
// import { useAuth } from "./AuthContext"

// const CartContext = createContext(undefined)

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }

// export const CartProvider = ({ children }) => {
//   const { user } = useAuth()
//   const [cartItems, setCartItems] = useState([])
//   const [cartCount, setCartCount] = useState(0)
//   const [loading, setLoading] = useState(false)

//   const fetchCartItems = async () => {
//     if (!user) return

//     try {
//       setLoading(true)
//       const items = await getCartByUser(user.id)
//       setCartItems(items || [])

//       // Calculate total count
//       const count = items.reduce((total, item) => total + item.quantity, 0)
//       setCartCount(count)
//     } catch (error) {
//       console.error("Error fetching cart:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch cart items when user changes
//   useEffect(() => {
//     if (user) {
//       fetchCartItems()
//     } else {
//       setCartItems([])
//       setCartCount(0)
//     }
//   }, [user])

//   // Function to update cart (to be called after cart operations)
//   const updateCart = () => {
//     fetchCartItems()
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartCount,
//         loading,
//         updateCart,
//         fetchCartItems,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

