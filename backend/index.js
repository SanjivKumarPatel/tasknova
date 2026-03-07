import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error:", err));

app.get("/task", (req, res) => {
  res.send("Task Route Working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});