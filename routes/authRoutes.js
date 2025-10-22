import express from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// post route register
router.post("/register", registerUser);

// post router login
router.post("/login", loginUser);

// post router logout
router.post("/logout", logout);

router.get("/", protect, getUserProfile);

export default router;
