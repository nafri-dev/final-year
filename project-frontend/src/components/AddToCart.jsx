/* eslint-disable react/prop-types */


import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AddToCart = ({ product, selectedSize, quantity, onAddToCartSuccess }) => {
  const { addItemToCart, cart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isInCart, setIsInCart] = useState(false)

  // Check if product is already in cart
  useEffect(() => {
    if (user && cart) {
      const productInCart = cart.some(
        (item) => item.productId === product.customId && item.size === selectedSize && item.color === product.color,
      )
      setIsInCart(productInCart)
    }
  }, [user, cart, product, selectedSize])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart")
      return
    }

    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }

    if (isInCart) {
      navigate("/cart")
      return
    }

    try {
      await addItemToCart(
        product.customId,
        quantity,
        product.name,
        product.price,
        product.imageUrl,
        selectedSize,
        product.color,
      )
      setIsInCart(true)
      toast.success("Product added to cart")
      onAddToCartSuccess()
    } catch (err) {
      console.error("Error adding to cart:", err)
      toast.error("Failed to add product to cart")
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      className=" bg-yellow-400 text-black px-6 py-2 rounded-lg hover:border-neutral-950 transition-colors"
      disabled={!product.inStock}
    >
      {!user ? "Login to Add to Cart" : !product.inStock ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
    </button>
  )
}

export default AddToCart

