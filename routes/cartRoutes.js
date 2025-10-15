import express from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getCartItems);
router.post("/add", protect, addToCart);
router.put("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeCartItem);

export default router;
