const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
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
    min: 0,
  },
  category: {
    type: Number,
    required: true,
  },
  sizes: {
    type: [String],
    default: [],
  },
  color: String,
  material: String,
  pattern: String,
  brand: String,
  customId: {
    type: String,
    unique: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})



const Product = mongoose.model("Product", productSchema)

module.exports = Product

