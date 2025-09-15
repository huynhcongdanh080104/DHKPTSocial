import {Order} from '../models/orderModel.js';
import {Shipper} from '../models/shipperModel.js';
import {Warehouse} from '../models/warehouseModel.js';
import{Shipping} from '../models/shippingModel.js';

export const layDonHangTaiKho = async (req, res) => {
    try {
      const { warehouseId } = req.params;
      const donHang = await Order.find({ 
        warehouse: warehouseId, 
        status: 'da_tiep_nhan' 
      });
  
      res.status(200).json({ danhSachDonHang: donHang });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error: err.message });
    }
  };
  export const phanPhoiDonHangTheoKhuVuc = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { shipperId } = req.body; // Có thể là shipper khu vực hoặc transmiter
  
      const donHang = await Order.findById(orderId);
      if (!donHang) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  
      const shipper = await Shipper.findById(shipperId);
      if (!shipper) return res.status(404).json({ message: 'Không tìm thấy shipper' });
  
      // Giả sử kho hiện tại có khu vực quản lý cụ thể
      const warehouse = await Warehouse.findById(donHang.warehouse);
      if (!warehouse) return res.status(404).json({ message: 'Không tìm thấy kho' });
  
      // Kiểm tra địa chỉ đơn hàng có thuộc khu của kho không
      const diaChiDonHang = donHang.address.toLowerCase();
      const khuVucKho = warehouse.region.toLowerCase();  // Cần có trường 'region' trong warehouseModel
  
      if (diaChiDonHang.includes(khuVucKho) && shipper.role === 'shipper') {
        // Giao cho shipper khu vực
        donHang.shipper = shipperId;
        donHang.status = 'da_phan_phoi_shipper';
  
        await donHang.save();
  
        return res.status(200).json({ message: 'Đơn hàng giao cho shipper khu vực thành công', donHang });
  
      } else if (shipper.role === 'transmiter') {
        // Giao cho transmiter để chuyển tới kho khác
        donHang.shipper = shipperId;
        donHang.status = 'dang_van_chuyen';
  
        // Có thể ghi log hành trình (shippingHistory) nếu muốn
  
        await donHang.save();
  
        return res.status(200).json({ message: 'Đơn hàng đã giao cho transmiter để vận chuyển kho khác', donHang });
      }
  
      res.status(400).json({ message: 'Shipper không hợp lệ cho phân phối này' });
  
    } catch (err) {
      res.status(500).json({ message: 'Lỗi phân phối đơn hàng', error: err.message });
    }
  };
    // WarehouseStaff tiếp nhận đơn hàng từ người bán → Tạo shipping mới
    export const receiveOrderFromSeller = async (req, res) => {
        try {
          const { orderId } = req.params;
      
          const order = await Order.findById(orderId);
          if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
          }
      
          const existingShipping = await Shipping.findOne({ orderId });
          if (existingShipping) {
            return res.status(400).json({ message: "Đơn hàng đã được tiếp nhận và có bản ghi shipping" });
          }
      
          const newShipping = new Shipping({
            orderId: order._id,
            status: "pending",
            recipientName: order.customerName || "Chưa có",
            recipientPhone: order.customerPhone || "Chưa có",
            recipientAddress: order.address,
            shippingCost: 0,
            estimatedDeliveryDate: null,
          });
      
          await newShipping.save();
      
          // Cập nhật trạng thái đơn hàng
          order.status = 'da_tiep_nhan';
          await order.save();
      
          res.status(201).json({ message: "Tiếp nhận đơn hàng thành công, đã tạo shipping", shipping: newShipping });
        } catch (error) {
          res.status(500).json({ message: "Lỗi tiếp nhận đơn hàng", error });
        }
      };
      