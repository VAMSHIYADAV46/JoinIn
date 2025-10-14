import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// Port setup
app.set("port", process.env.PORT || 8000);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Fix for path-to-regexp error with URLs containing colons
app.use((req, res, next) => {
  req.url = req.url.replace(/https?:\/\/[^/]+/g, encodeURIComponent);
  next();
});

// API routes
app.use("/api/v1/users", userRoutes);

// Serve React frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });
}

// Start server
const start = async () => {
  const DB_URL = `mongodb+srv://JoinIn:${process.env.DB_PASS}@joinin.nf6mqgz.mongodb.net/?retryWrites=true&w=majority&appName=JoinIn`;

  try {
    const connectionDb = await mongoose.connect(DB_URL);
    console.log(`✅ MONGO Connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Server running on port: ${app.get("port")}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

start();
