const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    // Individual product price
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  size: String,
  color: String,
})

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
})

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: shippingAddressSchema,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
})

// Generate a unique order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments()
    this.orderNumber = "ORD-" + (100000 + count).toString()
  }
  next()
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order

