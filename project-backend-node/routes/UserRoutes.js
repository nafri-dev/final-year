const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required!" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken!" })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    // Save the user
    const savedUser = await newUser.save()

    res.status(201).json({
      message: "User registered successfully",
      email: savedUser.email,
    })
  } catch (error) {
    console.error("Error in user registration:", error)
    res.status(500).json({ message: "Error registering user" })
  }
})

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.status(200).json({
      message: "Login successful",
      id: user._id,
      email: user.email,
    })
  } catch (error) {
    console.error("Error in user login:", error)
    res.status(500).json({ message: "Error logging in" })
  }
})

module.exports = router

