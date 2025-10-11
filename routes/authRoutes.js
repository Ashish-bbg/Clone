import express from "express";
import { loginUser, registerUser } from "../controllers/authControllers.js";

const router = express.Router();

// post route register
router.post("/register", registerUser);

// post router login
router.post("/login", loginUser);

export default router;
