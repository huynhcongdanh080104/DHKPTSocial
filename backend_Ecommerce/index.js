import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import smsRoute from "./routes/smsRoute.js";
import storeRoute from "./routes/storeRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import fileRoute from "./routes/fileRoute.js";
import orderRoute from "./routes/orderRoute.js";
import userRoute from "./routes/userRoute.js";
import adsRoute from "./routes/adsRoute.js";
import layoutRoute from "./routes/layoutRoute.js";
import cartRoute from "./routes/cartRoute.js"
import vnpayController from './vnpayController.js';

const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server, {
    cors: {
        origin: [
            "http://dhkptsocial.site", 
            "https://dhkptsocial.netlify.app",
            "https://giyuksite.online"
        ], // Đảm bảo đúng cổng của frontend
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: [
            "http://dhkptsocial.site", 
            "https://dhkptsocial.netlify.app",
            "https://giyuksite.online"
        ],
        credentials: true,
    })
);

// API Routes
app.get("/", (request, response) => {
    console.log(request);
    return response.status(200).send("Welcome to DHKPT Shop API");
});

app.use("/send-sms", smsRoute);
app.use("/store", storeRoute);
app.use("/categories", categoryRoute);
app.use("/cart", cartRoute);
app.use("/files", fileRoute);
app.use("/user", userRoute);
app.use("/product", (req, res, next) => { req.io = io; next();}, productRoute);
app.use("/order", (req, res, next) => { req.io = io; next();}, orderRoute);
app.use("/ads", (req, res, next) => { req.io = io; next();}, adsRoute);
app.use("/layout",  (req, res, next) => { req.io = io; next();}, layoutRoute);
app.use('/vnpay', vnpayController);
//app.use("/users", userRoute);


// **Socket.IO Logic**
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Lắng nghe sự kiện 'sendMessage' từ client
    socket.on("sendMessage", (message) => {
        console.log("Tin nhắn mới từ client:", message);

        // Phát tin nhắn mới đến tất cả các client
        io.emit("newMessage", message);
    });

    // Xử lý khi client ngắt kết nối
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });

});

// Kết nối đến MongoDB và khởi động server
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log(`Đã kết nối đến MongoDB!`);
        server.listen(PORT, () => {
            console.log(`Server đang lắng nghe trên cổng: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Lỗi kết nối MongoDB:", error);
    });
