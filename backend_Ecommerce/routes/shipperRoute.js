import express from 'express';
import {
  loginShipper,
  getAllShippers,
  updateDeliveryStatus,
  createShipper,
  getFreeShipper,
  getShipperProfile,
  updateShipperStatus,
  getWarehouseOrders,
  acceptOrder,
  getShipperOrders
} from '../controllers/shipperController.js';

const router = express.Router();

router.post('/login', loginShipper);
router.get('/', getAllShippers);
router.post('/', createShipper);
router.put('/:id/delivery-status', updateDeliveryStatus);
router.get('/getToShip/:province', getFreeShipper);
router.get('/profile/:shipperId', getShipperProfile);
router.put('/status/:shipperId', updateShipperStatus);
router.get('/warehouseorders', getWarehouseOrders);
router.post('/acceptorder/:orderId', acceptOrder);
router.get('/orders', getShipperOrders);

export default router;
