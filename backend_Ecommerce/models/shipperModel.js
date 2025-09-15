import mongoose from "mongoose";

const shipperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    enum: ['shipper', 'transmiter'], // giao hàng khu vực hoặc liên tỉnh
    default: 'shipper',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
  },
  deliveryStatus: {
    type: String,
    enum: ['available', 'delivering', 'off'],
    default: 'off',
  },
  assignedWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
shipperSchema.index({ username: 1 });
shipperSchema.index({ phone: 1 });

module.exports = mongoose.model('Shipper', shipperSchema);
