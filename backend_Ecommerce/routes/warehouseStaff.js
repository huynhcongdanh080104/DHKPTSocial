import express from 'express';
import {
  layDonHangTaiKho,
  phanPhoiDonHangTheoKhuVuc
} from '../controllers/warehouseStaffController.js';

const router = express.Router();

// Xem đơn hàng tại kho
router.get('/don-hang/:warehouseId', layDonHangTaiKho);

// Phân phối đơn hàng
router.post('/phan-phoi/:orderId', phanPhoiDonHangTheoKhuVuc);

export default router;
