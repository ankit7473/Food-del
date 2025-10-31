import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, deleteOrder, userOrders,listOrders, updateStatus } from "../controls/orderController.js";

const orderRouter = express.Router();

// ✅ Create Razorpay order
orderRouter.post("/place", authMiddleware, placeOrder);

// ✅ Verify Razorpay payment
orderRouter.post("/verify", authMiddleware, verifyOrder);

// ❌ Delete order if payment failed or cancelled
orderRouter.post("/delete", deleteOrder);

orderRouter.post("/userorders",authMiddleware,userOrders)

orderRouter.get("/list",listOrders)

orderRouter.post("/status",updateStatus)
export default orderRouter;
