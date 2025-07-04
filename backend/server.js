const express = require("express");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const pool = require("./db");
const multer = require("multer");

// Import routes
const userAuthRoutes = require("./routes/userAuth");
// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const datasetroute = require("./routes/datasetroute");

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/datasets", datasetroute);
app.use("/api/recommendations", require("./routes/recommendationroute"));
// User authentication routes
app.use('/api/user-auth', userAuthRoutes)
// Test the connection
// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("PostgreSQL connection error:", err);
//   } else {
//     console.log("PostgreSQL connected at:", res.rows[0].now);
//   }
// });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }
  res.status(500).json({ error: error.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Data Visualizer API running on port ${PORT}`);
});
