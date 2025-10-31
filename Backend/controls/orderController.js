import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { log } from "console";

let razorpay = null;

const initializeRazorpay = async () => {
  const RazorpayModule = await import("razorpay");
  const Razorpay = RazorpayModule.default;
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

initializeRazorpay();

// ✅ Create Razorpay Order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
    });
    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      orderDbId: newOrder._id,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.json({ success: false, message: "Payment creation failed!" });
  }
};

// ✅ Verify Razorpay Payment
const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDbId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderDbId, { payment: true });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderDbId);
      res.json({ success: false, message: "Invalid signature, order deleted" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.json({ success: false, message: "Payment verification failed" });
  }
};

// ❌ Delete Order if payment failed or user closed popup
const deleteOrder = async (req, res) => {
  try {
    const { orderDbId } = req.body;
    if (!orderDbId)
      return res.json({ success: false, message: "Missing order ID" });

    await orderModel.findByIdAndDelete(orderDbId);
    res.json({
      success: true,
      message: "Order deleted due to failed/cancelled payment",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.json({ success: false, message: "Failed to delete order" });
  }
};

// user orders for frontend 
const userOrders = async (req,res)=>{
    try {
      const orders = await orderModel.find({userId:req.userId})
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"error"})
      
    }
}

// listing orders for admin panel


const listOrders = async (req,res) => {
  try {
    const orders= await orderModel.find({});
    res.json({success:true,data:orders})
    
  } catch (error) {
    console.log("Error in admin backend"+ error)
    res.json({success:false,message:"Error in getting the all orders"})
  }
}

// api for updateing order status 
 const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"error in status update"})
    }
 }

export { placeOrder, verifyOrder, deleteOrder,userOrders,listOrders,updateStatus };
