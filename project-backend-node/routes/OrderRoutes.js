const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const CartItem = require("../models/CartItem")
const Product = require("../models/Product")
const User = require("../models/User")
const Address = require("../models/Address")
const mongoose = require("mongoose")
const Razorpay = require("razorpay")
const crypto = require("crypto")

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})



// Save or update user address
router.post("/address",  async (req, res) => {
  try {
    const { userId, street, city, state, postalCode, country } = req.body

    if (!userId || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "All address fields are required" })
    }

    // Check if user already has an address
    let address = await Address.findOne({ userId: new mongoose.Types.ObjectId(userId) })

    if (address) {
      // Update existing address
      address.street = street
      address.city = city
      address.state = state
      address.postalCode = postalCode
      address.country = country
      await address.save()
    } else {
      // Create new address
      address = new Address({
        userId: new mongoose.Types.ObjectId(userId),
        street,
        city,
        state,
        postalCode,
        country,
      })
      await address.save()
    }

    res.status(200).json(address)
  } catch (error) {
    console.error("Error saving address:", error)
    res.status(500).json({ message: "Failed to save address", error: error.message })
  }
})

// Get user address
router.get("/address/:userId",  async (req, res) => {
  try {
    const address = await Address.findOne({ userId: new mongoose.Types.ObjectId(req.params.userId) })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    res.status(200).json(address)
  } catch (error) {
    console.error("Error fetching address:", error)
    res.status(500).json({ message: "Failed to fetch address", error: error.message })
  }
})

// Create a Razorpay order
router.post("/create-razorpay-order",  async (req, res) => {
  try {
    const { userId, amount } = req.body

    if (!userId || !amount) {
      return res.status(400).json({ message: "userId and amount are required" })
    }

    // Get user details for Razorpay
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Create a Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay amount in paise (100 paise = ₹1)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId: userId,
      },
    }

    const razorpayOrder = await razorpay.orders.create(options)

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    res.status(500).json({ message: "Failed to create Razorpay order", error: error.message })
  }
})

// Update the verify-payment endpoint to accept userId
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId } = req.body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "All payment verification fields are required" })
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" })
    }

    res.status(200).json({ verified: true })
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({ message: "Failed to verify payment", error: error.message })
  }
})

// Place an order
router.post("/place",  async (req, res) => {
  try {
    console.log("Order placement request received:", req.body)
    const { userId, totalAmount, razorpayOrderId, razorpayPaymentId, shippingAddressId } = req.body

    if (!userId || !totalAmount || !razorpayOrderId || !razorpayPaymentId || !shippingAddressId) {
      console.log("Missing required fields:", {
        hasUserId: !!userId,
        hasTotalAmount: !!totalAmount,
        hasRazorpayOrderId: !!razorpayOrderId,
        hasRazorpayPaymentId: !!razorpayPaymentId,
        hasShippingAddressId: !!shippingAddressId,
      })
      return res.status(400).json({
        message: "Missing required fields",
        required: ["userId", "totalAmount", "razorpayOrderId", "razorpayPaymentId", "shippingAddressId"],
        received: req.body,
      })
    }

    // Get the user's cart items
    console.log("Fetching cart items for user:", userId)
    const cartItems = await CartItem.find({ userId: new mongoose.Types.ObjectId(userId) })
    console.log("Cart items found:", cartItems.length)

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Log cart item details for debugging
    console.log(
      "Cart item details:",
      cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    )

    // Get the shipping address
    console.log("Fetching shipping address:", shippingAddressId)
    const shippingAddress = await Address.findById(shippingAddressId)

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address not found" })
    }

    // Fetch product details to get current prices
    const productIds = cartItems.map((item) => item.productId)
    console.log("Product IDs from cart:", productIds)

    // Check if we're dealing with custom IDs or ObjectIds
    let products = []
    try {
      // First try to find products by _id (for ObjectIds)
      const validObjectIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id))
      console.log("Valid ObjectIds:", validObjectIds)

      if (validObjectIds.length > 0) {
        const objectIdProducts = await Product.find({ _id: { $in: validObjectIds } })
        console.log("Products found by ObjectId:", objectIdProducts.length)
        products = [...objectIdProducts]
      }

      // Try finding by customId for the remaining products
      const customIds = productIds.filter((id) => !mongoose.Types.ObjectId.isValid(id))
      console.log("Custom IDs:", customIds)

      if (customIds.length > 0) {
        const customIdProducts = await Product.find({ customId: { $in: customIds } })
        console.log("Products found by customId:", customIdProducts.length)
        products = [...products, ...customIdProducts]
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      // Try finding by customId as fallback
      console.log("Trying fallback: finding all products by customId")
      products = await Product.find({ customId: { $in: productIds } })
      console.log("Products found by customId (fallback):", products.length)
    }

    // If we still don't have all products, throw an error
    if (products.length === 0) {
      throw new Error(`No products found for IDs: ${productIds.join(", ")}`)
    }

    // Create a map of product IDs to products for easy lookup
    const productMap = {}
    products.forEach((product) => {
      productMap[product._id.toString()] = product
      // Also map by customId if it exists
      if (product.customId) {
        productMap[product.customId] = product
      }
    })

    console.log("Product map keys:", Object.keys(productMap))

    // Calculate totals and add price to each item
    console.log("Creating order items")
    const orderItems = []

    for (const item of cartItems) {
      const productId = item.productId.toString()
      console.log(`Processing cart item with productId: ${productId}`)

      const product = productMap[productId]

      if (!product) {
        console.error(`Product not found for ID: ${productId}`)
        console.log("Available product IDs in map:", Object.keys(productMap))
        throw new Error(`Product not found: ${productId}`)
      }

      const price = product.price
      const total = price * item.quantity

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: price,
        total: total,
        size: item.size,
        color: item.color,
      })
    }

    // Calculate total amount
    const calculatedTotalAmount = orderItems.reduce((sum, item) => sum + item.total, 0)
    console.log("Calculated total:", calculatedTotalAmount, "Provided total:", totalAmount)

    // Verify that the calculated total matches the provided total
    if (Math.abs(calculatedTotalAmount - totalAmount) > 0.01) {
      return res.status(400).json({
        message: "Total amount mismatch",
        calculated: calculatedTotalAmount,
        provided: totalAmount,
      })
    }

    // Create the order
    console.log("Creating order")
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: orderItems,
      totalAmount: calculatedTotalAmount,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
    })

    console.log("Saving order")
    const savedOrder = await order.save()
    console.log("Order saved successfully:", savedOrder._id)

    // Clear the user's cart
    console.log("Clearing user cart")
    await CartItem.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    console.log("Cart cleared")

    res.status(201).json(savedOrder)
  } catch (error) {
    console.error("Error placing order:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Get all orders for a user
router.get("/user/:userId",  async (req, res) => {
  try {
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(req.params.userId) }).sort({ orderDate: -1 })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    res.status(500).json({ message: "Failed to fetch orders", error: error.message })
  }
})

// Get all orders (admin only)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "email").sort({ orderDate: -1 })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching all orders:", error)
    res.status(500).json({ message: "Failed to fetch orders", error: error.message })
  }
})

// Update order status (admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" })
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(400).json({ message: "Failed to update order status", error: error.message })
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
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ message: "Error fetching order", error: error.message })
  }
})

// Add a route to clear the cart
router.delete("/cart/clear/:userId",  async (req, res) => {
  try {
    const userId = req.params.userId

    // Delete all cart items for this user
    await CartItem.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })

    res.status(200).json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({ message: "Failed to clear cart", error: error.message })
  }
})

// Add a debugging route to check product IDs
router.get("/debug/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId

    // Try to find by _id
    let product = null
    try {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId)
      }
    } catch (error) {
      console.log("Not a valid ObjectId, trying customId")
    }

    // If not found, try by customId
    if (!product) {
      product = await Product.findOne({ customId: productId })
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        productId,
        isValidObjectId: mongoose.Types.ObjectId.isValid(productId),
      })
    }

    res.json({
      product,
      idType: mongoose.Types.ObjectId.isValid(productId) ? "ObjectId" : "customId",
    })
  } catch (error) {
    console.error("Debug error:", error)
    res.status(500).json({ message: "Error debugging product", error: error.message })
  }
})

module.exports = router

