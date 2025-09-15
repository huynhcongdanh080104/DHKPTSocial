import { Shipping } from "../models/shippingModel.js";
import { Order } from "../models/orderModel.js";


// Lấy danh sách đơn hàng (lọc theo trạng thái, source, phân trang)
export const getAllShippings = async (req, res) => {
  try {
    const { status, source, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (source) query.source = source; // Lọc theo source: 'seller' hoặc 'transmiter'

    const shippings = await Shipping.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("orderId");

    const total = await Shipping.countDocuments(query);
    res.status(200).json({ total, shippings });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error });
  }
};


// Cập nhật trạng thái đơn hàng
export const updateShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const shipping = await Shipping.findById(id);
    if (!shipping) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    shipping.status = status;
    if (status === "delivered") {
      shipping.deliveredAt = new Date();
    }

    await shipping.save();

    // Đồng bộ với Order
    const order = await Order.findById(shipping.orderId);
    if (order) {
      order.status = status;
      await order.save();
    }

    res.status(200).json({ message: "Cập nhật trạng thái thành công", shipping });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái", error });
  }
};

// Thêm chặng vận chuyển (shippingStage)
export const addShippingStage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      carrier,
      trackingNumber,
      fromLocation,
      toLocation,
      status,
      shippedAt,
      deliveredAt
    } = req.body;

    const shipping = await Shipping.findById(id);
    if (!shipping) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    shipping.shippingStages.push({
      carrier,
      trackingNumber,
      fromLocation,
      toLocation,
      status,
      shippedAt,
      deliveredAt
    });

    await shipping.save();
    res.status(200).json({ message: "Thêm chặng vận chuyển thành công", shipping });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm chặng vận chuyển", error });
  }
};

export const createShipping = async (req, res) => {
  try{
    const {
      orderId,
      recipientName,
      recipientPhone,
      recipientAddress,
      shippingStages, // Danh sách các giai đoạn vận chuyển
    } = req.body;

    // Kiểm tra nếu đơn hàng đã có shipping
    const existingShipping = await Shipping.findOne({ orderId });
    if (existingShipping) {
      return res.status(400).json({ success: false, message: "Shipping already exists for this order" });
    }

    // Kiểm tra xem orderId có tồn tại trong hệ thống không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const newShipping = new Shipping({
      orderId,
      recipientName,
      recipientPhone,
      recipientAddress,
      shippingStages: shippingStages, // Gán danh sách các giai đoạn vận chuyển
    });

    await newShipping.save();

    res.status(201).json({ success: true, data: newShipping });
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
} 