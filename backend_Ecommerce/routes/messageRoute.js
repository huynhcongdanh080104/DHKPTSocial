import express from "express";
import { sendMessageToShop } from "../controllers/messageController.js";

const router = express.Router();
router.post("/send", sendMessageToShop);

export default router;
