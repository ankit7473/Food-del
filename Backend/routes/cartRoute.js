import express from 'express'
import { addToCart,removeFromCart,getCart } from '../controls/cartController.js'
import authMiddleeware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleeware,addToCart)
cartRouter.post("/remove",authMiddleeware,removeFromCart)
cartRouter.post("/get",authMiddleeware,getCart)

export default cartRouter;