import userModel from "../models/userModel.js";

// add item to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ use from middleware
    const { itemId } = req.body;

    let userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅
    const { itemId } = req.body;

    let userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
