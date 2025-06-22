// create-admin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      const name = process.env.ADMIN_NAME || "Admin";

      if (!email || !password) {
        console.error("Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file");
        process.exit(1);
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        console.log("✅ Admin user already exists.");
        return;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin user
      const admin = new Admin({
        email,
        password: hashedPassword,
        name,
        permissions: ["all"],
      });

      await admin.save();
      console.log("🎉 Admin user created successfully.");
    } catch (error) {
      console.error("❌ Error creating admin user:", error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
