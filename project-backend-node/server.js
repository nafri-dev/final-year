const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/products", require("./routes/ProductRoutes"))
app.use("/api/orders", require("./routes/OrderRoutes"))
app.use("/api/cart", require("./routes/CartRoutes"))
app.use("/api/categories", require("./routes/categoryRoutes"))
app.use("/api/users", require("./routes/UserRoutes"))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

