import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000 ))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {

  const DB_URL = `mongodb+srv://vamshi:${process.env.DB_PASS}@cluster0.zcqaull.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  // const DB_URL = `mongodb+srv://vamshi:${process.env.DB_PASS}@joinin.frwsy4q.mongodb.net/?retryWrites=true&w=majority&appName=JoinIn`
  


  try {
    const connectionDb = await mongoose.connect(DB_URL);

    console.log(`MONGO Connected: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server running on port : ${app.get("port")}`);
    });
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
  }
};



start();