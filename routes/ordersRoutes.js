import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOrders, placeOrders } from "../controllers/ordersControllers.js";
const router = express.Router();

router.post("/", protect, placeOrders);
router.get("/my", protect, getOrders);
export default router;
