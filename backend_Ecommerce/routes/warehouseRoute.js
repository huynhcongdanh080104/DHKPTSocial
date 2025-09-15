
// routes/warehouseRoute.js
import express from "express";
import {
  getWarehouses,
  createWarehouse,
  assignOrderToShipper
} from "../controllers/warehouseController.js";

const router = express.Router();

router.get("/", getWarehouses);
router.post("/", createWarehouse);
router.post("/assign-order", assignOrderToShipper);

export default router;
