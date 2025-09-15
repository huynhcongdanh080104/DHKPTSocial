import { Message } from "../models/messageModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const sendMessageToShop = async (req, res) => {
    try {
        console.log("📩 Nhận được yêu cầu gửi tin nhắn:", req.body);

        const { sender, receiver, message } = req.body;
        if (!sender || !receiver || !message) {
            console.error("❌ Thiếu dữ liệu yêu cầu:", req.body);
            return res.status(400).json({ error: "Thiếu dữ liệu cần thiết" });
        }

        // Lưu tin nhắn vào database
        const userMessage = new Message({ sender, receiver, message });
        await userMessage.save();
        console.log("✅ Tin nhắn đã lưu vào database");

        // Gọi API OpenAI với cơ chế retry
        const callOpenAI = async (retryCount = 0) => {
            try {
                const aiResponse = await axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: message }],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("✅ Phản hồi từ AI:", aiResponse.data);
                return aiResponse.data.choices[0].message.content;
            } catch (apiError) {
                if (apiError.response && apiError.response.status === 429 && retryCount < 5) {
                    const retryAfter = Math.pow(2, retryCount) * 1000; // Exponential backoff
                    console.warn(`⛔ Quá nhiều yêu cầu đến API OpenAI. Thử lại sau ${retryAfter / 1000} giây.`);
                    await new Promise(resolve => setTimeout(resolve, retryAfter));
                    return callOpenAI(retryCount + 1);
                } else {
                    throw apiError;
                }
            }
        };

        const aiResponseContent = await callOpenAI();
        res.status(200).json({
            response: aiResponseContent,
        });
    } catch (error) {
        console.error("⛔ Lỗi server khi xử lý tin nhắn:", error);
        res.status(500).json({
            error: "Lỗi server khi xử lý tin nhắn",
            details: error.message,
        });
    }
};
