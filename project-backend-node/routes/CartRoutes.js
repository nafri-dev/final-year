const express = require("express")
const router = express.Router()
const CartItem = require("../models/CartItem")
const mongoose = require("mongoose")

// Add to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity, productName, price, imageUrl, size, color } = req.body

    if (!userId || !productId || !quantity || !productName || !price || !imageUrl || !size || !color) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if the item already exists in the cart
    let cartItem = await CartItem.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId,
      size,
      color,
    })

    if (cartItem) {
      // If the item exists, update the quantity
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      // If the item doesn't exist, create a new one
      cartItem = new CartItem({
        userId: new mongoose.Types.ObjectId(userId),
        productId,
        quantity,
        productName,
        price,
        imageUrl,
        size,
        color,
      })
      await cartItem.save()
    }

    console.log("Cart item saved:", cartItem) // Add this line for debugging

    res.status(201).json(cartItem)
  } catch (err) {
    console.error("Error adding to cart:", err)
    res.status(400).json({ message: err.message })
  }
})

// Get cart by user
router.get("/user/:userId", async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: new mongoose.Types.ObjectId(req.params.userId) })
    res.json(cartItems)
  } catch (err) {
    console.error("Error fetching cart:", err)
    res.status(500).json({ message: err.message })
  }
})

// Remove from cart
router.delete("/remove/:cartItemId", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.cartItemId)
    res.json({ message: "Cart item removed" })
  } catch (err) {
    console.error("Error removing from cart:", err)
    res.status(500).json({ message: err.message })
  }
})

// Update cart item quantity
router.put("/update/:cartItemId", async (req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.cartItemId,
      { quantity: req.body.quantity },
      { new: true },
    )
    res.json(updatedItem)
  } catch (err) {
    console.error("Error updating cart item:", err)
    res.status(400).json({ message: err.message })
  }
})

module.exports = router

