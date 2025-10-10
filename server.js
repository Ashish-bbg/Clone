import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import User from "./models/userModel.js";
import Review from "./models/reviewModel.js";
import Product from "./models/productModel.js";

dotenv.config();
// connect to db
connectDB();

// app
const app = express();
app.use(express.json());

// Allowing all origin
app.use(cors());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Everything is fine and running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
