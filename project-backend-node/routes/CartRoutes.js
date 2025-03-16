const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const CartItem = require("../models/CartItem")
const Product = require("../models/Product")



// Add item to cart
router.post("/add", async (req, res) => {
  try {
    console.log("Add to cart request:", req.body)
    const { userId, productId, quantity, productName, price, imageUrl, size, color } = req.body

    if (!userId || !productId || !quantity || !productName || !price) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["userId", "productId", "quantity", "productName", "price"],
        received: req.body,
      })
    }

    // Make sure productId is a string
    const productIdStr = productId ? productId.toString() : ""

    // Check if the item already exists in the cart
    let cartItem = await CartItem.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: productIdStr,
      size: size || null,
      color: color || null,
    })

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += Number(quantity)
      await cartItem.save()
      console.log("Updated existing cart item:", cartItem)
    } else {
      // Create new cart item
      cartItem = new CartItem({
        userId: new mongoose.Types.ObjectId(userId),
        productId: productIdStr,
        productName,
        quantity: Number(quantity),
        price: Number(price),
        imageUrl,
        size,
        color,
      })
      await cartItem.save()
      console.log("Created new cart item:", cartItem)
    }

    res.status(201).json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({ message: "Failed to add item to cart", error: error.message })
  }
})

// Get user's cart
router.get("/user/:userId", async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: new mongoose.Types.ObjectId(req.params.userId) })
    res.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({ message: "Failed to fetch cart", error: error.message })
  }
})

// Update cart item quantity
router.put("/update/:cartItemId",  async (req, res) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" })
    }

    const cartItem = await CartItem.findByIdAndUpdate(
      req.params.cartItemId,
      { quantity: Number(quantity) },
      { new: true },
    )

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    res.json(cartItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    res.status(500).json({ message: "Failed to update cart item", error: error.message })
  }
})

// Remove item from cart
router.delete("/remove/:cartItemId",  async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.cartItemId)

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    res.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing cart item:", error)
    res.status(500).json({ message: "Failed to remove cart item", error: error.message })
  }
})

// Clear user's cart
router.delete("/clear/:userId",  async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: new mongoose.Types.ObjectId(req.params.userId) })
    res.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({ message: "Failed to clear cart", error: error.message })
  }
})

module.exports = router

