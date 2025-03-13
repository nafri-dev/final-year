const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Import models
const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

// Authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if adminId exists in the token
    if (!decoded.adminId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/assets")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed!"))
  },
})
// ===== AUTHENTICATION ROUTES =====

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token
router.get("/verify", authenticateAdmin, (req, res) => {
  res.json({
    user: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name
    },
  });
});

// ===== ADMIN USER MANAGEMENT =====

// Create a new admin user
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password, adminSecret, name } = req.body;

    // Verify the admin secret to prevent unauthorized admin creation
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const admin = new Admin({
      email,
      password: hashedPassword,
      name: name || "Admin"
    });

    await admin.save();

    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all admin users (super admin only)
router.get("/admins", authenticateAdmin, async (req, res) => {
  try {
    // Check if the requesting admin has super admin permissions
    if (!req.admin.permissions.includes("all") && !req.admin.permissions.includes("manage_admins")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update admin user
router.put("/admins/:id", authenticateAdmin, async (req, res) => {
  try {
    // Check if the requesting admin has super admin permissions
    if (!req.admin.permissions.includes("all") && !req.admin.permissions.includes("manage_admins")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, permissions } = req.body;
    const updates = { name, email, permissions };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change admin password
router.put("/change-password", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const admin = await Admin.findById(req.admin._id);
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== DASHBOARD STATISTICS =====

// Dashboard stats
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Orders by status
router.get("/orders/by-status", authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const ordersByStatus = result.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    res.json(ordersByStatus);
  } catch (error) {
    console.error("Orders by status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Sales by day
router.get("/sales/by-day", authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$orderDate" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const salesByDay = result.map((item) => ({
      day: daysOfWeek[item._id - 1],
      revenue: item.revenue,
    }));

    res.json(salesByDay);
  } catch (error) {
    console.error("Sales by day error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Sales by month
router.get("/sales/by-month", authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesByMonth = result.map((item) => ({
      month: months[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
      count: item.count
    }));

    res.json(salesByMonth);
  } catch (error) {
    console.error("Sales by month error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ORDER MANAGEMENT =====

// Get all orders
router.get("/orders", authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email username")
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order by ID
router.get("/orders/:id", authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "email username")
      .populate("items.productId", "name price imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status
router.put("/orders/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order details
router.put("/orders/:id", authenticateAdmin, async (req, res) => {
  try {
    const { shippingAddress, items, totalAmount, status } = req.body;
    const updates = { shippingAddress, items, totalAmount, status };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete order
router.delete("/orders/:id", authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== PRODUCT MANAGEMENT =====

// Get all products
router.get("/products", authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get product by ID
router.get("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create product
router.post("/products", authenticateAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product
router.put("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Bulk create products
router.post("/products/bulk", authenticateAdmin, async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products data" });
    }
    
    const savedProducts = await Product.insertMany(products);
    res.status(201).json(savedProducts);
  } catch (error) {
    console.error("Bulk create products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    // Original path where the image is saved in the backend
    const originalPath = req.file.path

    // Get the filename
    const filename = req.file.filename

    // Define paths for frontend and admin projects
    // Adjust these paths based on your actual project structure
    const frontendPath = path.resolve(__dirname, "../../project-frontend/public/assets", filename)
    const adminPath = path.resolve(__dirname, "../../project-admin/public/assets", filename)

    // Create directories if they don't exist
    const frontendDir = path.dirname(frontendPath)
    const adminDir = path.dirname(adminPath)

    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true })
    }

    if (!fs.existsSync(adminDir)) {
      fs.mkdirSync(adminDir, { recursive: true })
    }

    // Copy the file to frontend and admin projects
    fs.copyFileSync(originalPath, frontendPath)
    fs.copyFileSync(originalPath, adminPath)

    // Return the URL that can be used to access the image
    const imageUrl = `/assets/${filename}`

    res.status(200).json({
      message: "Image uploaded successfully",
      url: imageUrl,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    })
  }
})

// ===== CATEGORY MANAGEMENT =====

// Get all categories
router.get("/categories", authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get category by ID
router.get("/categories/:id", authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create category
router.post("/categories", authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    
    const category = new Category({ name, description });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update category
router.put("/categories/:id", authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category name already exists (except for this category)
    if (name) {
      const existingCategory = await Category.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      { name, description }, 
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category
router.delete("/categories/:id", authenticateAdmin, async (req, res) => {
  try {
    // Check if any products are using this category
    const productsWithCategory = await Product.countDocuments({ category: req.params.id });
    
    if (productsWithCategory > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category because it is being used by products",
        productsCount: productsWithCategory
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== USER MANAGEMENT =====

// Get all users
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID
router.get("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const updates = { username, email, role };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, delete related data like orders
    // await Order.deleteMany({ userId: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;