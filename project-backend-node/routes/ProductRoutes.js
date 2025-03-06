const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const mongoose = require("mongoose")

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    console.error("Error fetching products:", err)
    res.status(500).json({ message: "Error fetching products", error: err.message })
  }
})

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    let product

    // Try to find by customId first
    product = await Product.findOne({ customId: id })

    // If not found by customId, try to find by _id (if it's a valid ObjectId)
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id)
    }

    // If still not found, try to find by a numeric ID (assuming it's stored as a string)
    if (!product) {
      product = await Product.findOne({ customId: id.toString() })
    }

    if (!product) {
      return res.status(404).json({ message: `Product not found with id: ${id}` })
    }

    res.json(product)
  } catch (err) {
    console.error("Error fetching product:", err)
    res.status(500).json({ message: "Error fetching product", error: err.message })
  }
})

// Add a single product
router.post("/add", async (req, res) => {
  try {
    const productData = {
      ...req.body,
      customId: req.body.customId || String(new mongoose.Types.ObjectId()),
    }
    const product = new Product(productData)
    const newProduct = await product.save()
    res.status(201).json(newProduct)
  } catch (err) {
    console.error("Error adding product:", err)
    res.status(400).json({ message: "Error adding product", error: err.message })
  }
})

// Add multiple products
router.post("/add-multiple", async (req, res) => {
  try {
    const productsWithCustomId = req.body.map((product) => ({
      ...product,
      customId: product.customId || String(new mongoose.Types.ObjectId()),
    }))
    const newProducts = await Product.insertMany(productsWithCustomId)
    res.status(201).json(newProducts)
  } catch (err) {
    console.error("Error adding multiple products:", err)
    res.status(400).json({ message: "Error adding multiple products", error: err.message })
  }
})

// Update a product
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params
    let product

    // First, try to find and update by customId
    product = await Product.findOneAndUpdate({ customId: id }, req.body, { new: true })

    // If not found, and the id is a valid ObjectId, try to find and update by _id
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndUpdate(id, req.body, { new: true })
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (err) {
    console.error("Error updating product:", err)
    res.status(400).json({ message: "Error updating product", error: err.message })
  }
})

// Delete a product
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params
    let result

    // First, try to find and delete by customId
    result = await Product.findOneAndDelete({ customId: id })

    // If not found, and the id is a valid ObjectId, try to find and delete by _id
    if (!result && mongoose.Types.ObjectId.isValid(id)) {
      result = await Product.findByIdAndDelete(id)
    }

    if (!result) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    console.error("Error deleting product:", err)
    res.status(500).json({ message: "Error deleting product", error: err.message })
  }
})

// Get products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    console.log("Fetching products for category:", req.params.categoryId)
    const products = await Product.find({ category: req.params.categoryId })
    console.log("Found products:", products)
    res.json(products)
  } catch (err) {
    console.error("Error fetching products by category:", err)
    res.status(500).json({ message: "Error fetching products by category", error: err.message })
  }
})

// Get similar products
router.get("/similar/:categoryId/:productId", async (req, res) => {
  try {
    const { categoryId, productId } = req.params
    console.log(`Fetching similar products for category ${categoryId} and product ${productId}`)

    const similarProducts = await Product.find({
      category: categoryId,
      customId: { $ne: productId },
    }).limit(4)

    console.log(`Found ${similarProducts.length} similar products`)
    res.json(similarProducts)
  } catch (err) {
    console.error("Error fetching similar products:", err)
    res.status(500).json({ message: "Error fetching similar products", error: err.message })
  }
})

module.exports = router

