const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path");
const dotenv = require("dotenv")
const adminRoutes = require("./routes/admin")
const Razorpay = require("razorpay");

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
app.use(
  cors({
    origin: [process.env.VITE_FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
)

app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))


  // Add this to your server.js file to ensure the uploads directory exists
const fs = require("fs")


// // Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, "public/uploads")
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

// // Also create the directories in frontend and admin projects
// const frontendUploadDir = path.join(__dirname, "../project-frontend/public/assets")
// const adminUploadDir = path.join(__dirname, "../project-admin/public/assets")

// if (!fs.existsSync(frontendUploadDir)) {
//   fs.mkdirSync(frontendUploadDir, { recursive: true })
// }

// if (!fs.existsSync(adminUploadDir)) {
//   fs.mkdirSync(adminUploadDir, { recursive: true })
// }

app.use("/uploads", express.static(path.join(__dirname, "public/assets")));


const razorpay = new Razorpay({
  key_id:"rzp_test_WJKewm80WgQ7hS",
  key_secret:"EgzjLFuKObYj96m8khBbXADr",
})

// Routes
app.use("/api/products", require("./routes/ProductRoutes"))
app.use("/api/orders", require("./routes/OrderRoutes"))
app.use("/api/cart", require("./routes/CartRoutes"))
app.use("/api/categories", require("./routes/categoryRoutes"))
app.use("/api/users", require("./routes/UserRoutes"))
app.use("/api/admin", adminRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

