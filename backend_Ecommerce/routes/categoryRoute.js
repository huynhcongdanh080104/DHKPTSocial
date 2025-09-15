import express from 'express';
import { Category } from '../models/categoryModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({ status: "Active" });

        const baseUrl = "https://dhkptsocial.onrender.com/files/download/";

        const categoriesWithImageUrls = categories.map((category) => ({
            ...category._doc,
            image: baseUrl + category.image, // Thêm đường dẫn ảnh đầy đủ
        }));

        res.status(200).json(categoriesWithImageUrls);
    } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
    }
});
export default router;