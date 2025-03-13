// This is a standalone script to create an admin user
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const name = args[2] || "Admin";

if (!email || !password) {
  console.error("Usage: node create-admin.js <email> <password> [name]");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        console.log("Admin user already exists");
        process.exit(0);
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the admin user
      const admin = new Admin({
        email,
        password: hashedPassword,
        name,
        permissions: ["all"]
      });

      await admin.save();
      console.log("Admin user created successfully");
    } catch (error) {
      console.error("Error creating admin user:", error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });