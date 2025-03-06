const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
      },
    ],
    color: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    pattern: {
      type: String,
    },
    brand: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Create a text index on the customId field for faster string-based lookups
productSchema.index({ customId: "text" })

module.exports = mongoose.model("Product", productSchema)

