import express from "express";
import { Review } from "../models/reviewModel.js";
import { Order } from "../models/orderModel.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Gửi đánh giá
router.post("/", async (req, res) => {
    try {
        const { userId, productId, comment, rating } = req.body;

        // Kiểm tra người dùng đã mua hàng và status là shipped
        const hasPurchased = await Order.exists({
            customer: new mongoose.Types.ObjectId(userId),
            status: "shipped",
            "items.productId": new mongoose.Types.ObjectId(productId),
        });

        if (!hasPurchased) {
            return res
                .status(403)
                .json({ message: "Bạn chưa mua sản phẩm này!" });
        }
        const alreadyReviewed = await Review.exists({ userId, productId });
        if (alreadyReviewed) {
            return res
                .status(400)
                .json({ message: "Bạn đã đánh giá sản phẩm này rồi!" });
        }
        const review = new Review({ userId, productId, comment, rating });
        await review.save();

        res.status(201).json({ message: "Đánh giá thành công!", review });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

// ✅ Lấy danh sách đánh giá theo sản phẩm
router.get("/product/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate("userId", "name avatar")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

export default router;
