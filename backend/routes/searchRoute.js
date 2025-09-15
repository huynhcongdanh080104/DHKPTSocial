import express from "express";
import {
    getMayKnowUsers,
    getRandomUsers,
    searchUsers,
} from "../controllers/searchController.js";

const router = express.Router();

// Route để lấy danh sách người dùng có thể bạn biết
router.get("/may-know", getMayKnowUsers);

router.get("/random", getRandomUsers);
// Route để tìm kiếm người dùng theo tên
router.get("/users", searchUsers);

export default router;
