import express from 'express';
import { loginShipper } from '../controllers/authController.js';

const router = express.Router();

router.post('/login-shipper', loginShipper);

export default router;
