import {Warehouse} from '../models/warehouseModel.js';
import {Shipper} from '../models/shipperModel.js';

// Tạo kho mới
export const createWarehouse = async (req, res) => {
  try {
    const { tenKho, diaChi, soDienThoai, emailLienHe } = req.body;
    const kho = new Warehouse({
      name: tenKho,
      location: diaChi,
      contactPhone: soDienThoai,
      contactEmail: emailLienHe,
    });
    await kho.save();
    res.status(201).json({ message: 'Tạo kho thành công', kho });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo kho', error: err.message });
  }
};

// Lấy danh sách tất cả kho
export const getWarehouses = async (req, res) => {
  try {
    const danhSachKho = await Warehouse.find();
    res.status(200).json({ danhSachKho });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách kho', error: err.message });
  }
};

// Lấy thông tin kho theo ID
export const layKhoTheoId = async (req, res) => {
  try {
    const kho = await Warehouse.findById(req.params.id);
    if (!kho) return res.status(404).json({ message: 'Không tìm thấy kho' });
    res.status(200).json({ kho });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin kho', error: err.message });
  }
};

// Cập nhật thông tin kho
export const capNhatKho = async (req, res) => {
  try {
    const capNhat = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!capNhat) return res.status(404).json({ message: 'Không tìm thấy kho' });
    res.status(200).json({ message: 'Cập nhật kho thành công', kho: capNhat });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật kho', error: err.message });
  }
};

// Xóa kho
export const xoaKho = async (req, res) => {
  try {
    const xoa = await Warehouse.findByIdAndDelete(req.params.id);
    if (!xoa) return res.status(404).json({ message: 'Không tìm thấy kho' });
    res.status(200).json({ message: 'Xóa kho thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa kho', error: err.message });
  }
};

// Lấy danh sách shipper thuộc kho
export const layDanhSachShipperTrongKho = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const danhSachShipper = await Shipper.find({ assignedWarehouse: warehouseId });
    res.status(200).json({ danhSachShipper });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách shipper', error: err.message });
  }
};
// Gán đơn hàng cho shipper
export const assignOrderToShipper = async (req, res) => {
  try {
    const { orderId, shipperId } = req.body;
    // Giả sử bạn có model Order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.assignedShipper = shipperId;
    await order.save();

    res.status(200).json({ message: 'Giao đơn hàng cho shipper thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi giao đơn hàng', error: err.message });
  }
};

