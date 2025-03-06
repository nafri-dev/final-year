const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// Add a compound index to ensure uniqueness of userId, productId, size, and color combination
cartItemSchema.index({ userId: 1, productId: 1, size: 1, color: 1 }, { unique: true })

module.exports = mongoose.model("CartItem", cartItemSchema)

