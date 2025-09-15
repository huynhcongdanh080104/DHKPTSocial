import mongoose from "mongoose";

const ShippingStageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["transmiter", "shipper", "warehouseStaff"],
    required: true,
  },
  handler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fromLocation: {
    type: String,
    required: true,
  },
  toLocation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_transit", "completed", "canceled"],
    default: "pending",
  },
  shippedAt: Date,
  deliveredAt: Date,
});

const ShippingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true,
  },

  // Tổng trạng thái của quá trình giao hàng
  status: {
    type: String,
    enum: ["pending", "in_transit", "delivered", "canceled"],
    default: "pending",
  },

  shippingStages: [ShippingStageSchema], // Nhiều giai đoạn giao hàng

  // Thông tin người nhận
  recipientName: {
    type: String,
    required: true,
  },
  recipientPhone: {
    type: String,
    required: true,
  },
  recipientAddress: {
    type: String,
    required: true,
  },

  shippingCost: {
    type: Number,
    default: 0,
  },

  estimatedDeliveryDate: Date,

  deliveredAt: Date, // Ngày hoàn tất giao hàng cuối cùng
  
  source: {
    type: String,
    enum: ['seller', 'transmiter'],
    default: 'seller',  // mặc định từ người bán
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Shipping = mongoose.model("Shipping", ShippingSchema);
