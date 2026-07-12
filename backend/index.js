const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");
const authRoutes = require("./routes/auth");
const exceptionsRoutes = require("./routes/exceptions");
const risksRoutes = require("./routes/risks");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to allow dashboard domain and credentials
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/exceptions", exceptionsRoutes);
app.use("/api/risks", risksRoutes);

// General health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Initialize database and start the server
const startServer = async () => {
  try {
    await db.initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[server] Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[server] Failed to start database or server:", err);
    process.exit(1);
  }
};

startServer();
