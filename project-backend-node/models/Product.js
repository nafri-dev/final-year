const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: Number,  // This should match what you're sending from the frontend
    required: true
  },
  sizes: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    default: ""
  },
  material: {
    type: String,
    default: ""
  },
  pattern: {
    type: String,
    default: ""
  },
  brand: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  },
  inStock: {
    type: Boolean,
    default: true
  },
  customId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ProductSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);