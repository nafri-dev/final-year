const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const CartItem = require("../models/CartItem")
const mongoose = require("mongoose")

// Place an order
router.post("/place", async (req, res) => {
  try {
    const { userId, totalAmount } = req.body

    if (!userId || !totalAmount) {
      return res.status(400).json({ message: "userId and totalAmount are required" })
    }

    const cartItems = await CartItem.find({ userId: new mongoose.Types.ObjectId(userId) })

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
    })

    const savedOrder = await order.save()

    // Clear the user's cart
    await CartItem.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })

    res.status(201).json(savedOrder)
  } catch (err) {
    console.error("Error placing order:", err)
    res.status(400).json({ message: err.message })
  }
})

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "email")
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(updatedOrder)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "email")
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (err) {
    console.error("Error fetching order:", err)
    res.status(500).json({ message: "Error fetching order", error: err.message })
  }
})

module.exports = router

