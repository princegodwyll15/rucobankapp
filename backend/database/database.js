const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the process if connection fails
  });
