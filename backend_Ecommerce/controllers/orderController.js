import { Order } from "../models/orderModel.js";
import { Store } from "../models/storeModel.js";
import mongoose from "mongoose";

export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ customer: userId })
            .populate("items.productId", "name price store") // Lấy thông tin sản phẩm + store
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian đặt hàng

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách đơn hàng" });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { customer, items, shipper } = req.body;
        if (!customer || !items || !shipper) {
            return res.status(400).json({ error: "Thiếu dữ liệu cần thiết" });
        }

        const newOrder = new Order({ customer, items, shipper });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server khi tạo đơn hàng", details: error.message });
    }
};

export const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("items.productId", "name price store") // 🔥 Thêm store ở đây
            .populate("customer", "name email") // Lấy thông tin khách hàng
            .populate("shipper", "name phone");

        if (!order) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
        }

        // 🔥 Lấy danh sách store từ các sản phẩm trong đơn hàng
        const storeIds = [
            ...new Set(
                order.items.map((item) => item.productId?.store).filter(Boolean)
            ),
        ];

        // 🔥 Populate thông tin Store
        const stores = await Store.find({ _id: { $in: storeIds } }).select(
            "name logo address"
        );

        // 🔥 Gửi dữ liệu chuẩn
        res.status(200).json({ order, stores });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        res.status(500).json({ error: "Lỗi khi lấy chi tiết đơn hàng" });
    }
};
