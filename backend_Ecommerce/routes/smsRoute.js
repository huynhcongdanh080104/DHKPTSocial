import 'dotenv/config';
import express from 'express';
import {Vonage}  from '@vonage/server-sdk';

const router = express.Router();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

router.post('/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    try {
        const response = await vonage.verify.start({
            number: phone,
            brand: "DHKShop" // Tên hiển thị khi gửi OTP
        });

        res.json({ success: true, requestId: response.request_id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * 2️⃣ Xác minh OTP
 */
router.post('/verify-otp', async (req, res) => {
    const { requestId, code } = req.body;

    if (!requestId || !code) {
        return res.status(400).json({ success: false, message: "Request ID and code are required" });
    }

    try {
        const response = await vonage.verify.check({
            request_id: requestId,
            code: code
        });

        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/send-sms', async (req, res) =>{
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ success: false, message: "Phone number, code are required" });
    }
    try{
        const response = await vonage.sms.send({
            to: phone, // Brand Name
            from: "Vonage",
            text: `Tin nhắn thử nghiệm`
        });
        res.json({ success: true, response: response });
    }catch(error){
        res.status(400).json({ success: false, error: error });
    }
})
export default router;