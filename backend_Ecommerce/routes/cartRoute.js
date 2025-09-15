import {
    getCart,
    createCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    getUserCart
} from "../controllers/cartController.js";

import express from "express";
const router = express.Router();
router.get("/user/:userId", getUserCart)
router.get("/:cartId", getCart);
router.post("/create", createCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);

export default router;
