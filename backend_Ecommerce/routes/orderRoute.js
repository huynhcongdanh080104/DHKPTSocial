import express from 'express';
import { Order } from '../models/orderModel.js';
import  Cart  from '../models/cartModel.js';
import { getOrdersByUser, getOrderDetail } from '../controllers/orderController.js';
import mongoose from 'mongoose';
const router = express.Router();

router.get("/store/:storeId", async (req, res) => {
    try {
        const { storeId } = req.params;

        // Kiểm tra xem storeId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: "Invalid store ID" });
        }

        // Tìm tất cả đơn hàng có sản phẩm thuộc storeId
        const orders = await Order.find()
            .populate({
                path: "items.productId",
                populate: { path: "store" } 
            })
            .populate('customer').populate('shipper');

        // Lọc ra đơn hàng có ít nhất một sản phẩm thuộc storeId
        const filteredOrders = orders.filter(order =>
            order.items.some(item => item.productId.store.equals(storeId))
        );

        res.json(filteredOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { userId, items } = req.body;
  
    // Tạo đơn hàng
    const newOrder = new Order(req.body);
    await newOrder.save();

    const populatedOrder = await Order.findById(newOrder._id).populate("customer").populate("items.productId");
    // Gửi sự kiện và phản hồi
    req.io.emit("orderAdded", populatedOrder);
    res.status(201).json(newOrder);
  });

  router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate("customer")
            .populate({
                path: "items.productId", 
                select: "name price image" // Chỉ lấy các trường cần thiết
            })
            

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        req.io.emit("orderUpdated", updatedOrder);

        return res.json({ 
            message: 'Order updated successfully', 
            order: updatedOrder 
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete a product by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.io.emit("orderDeleted", { orderId: req.params.id });

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/check-review/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const order = await Order.findOne({
            customer: new mongoose.Types.ObjectId(userId),
            status: "shipped",
            "items.productId": new mongoose.Types.ObjectId(productId),
        });

        console.log("ORDER FOUND:", order);

        if (!order) {
            return res
                .status(403)
                .json({ message: "Bạn chưa mua sản phẩm này!" });
        }

        // ✅ Nếu có đơn hàng thỏa điều kiện
        return res.status(200).json({ canReview: true });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi kiểm tra quyền đánh giá",
            error: err.message,
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const { status, startDate, endDate, month, year } = req.query;

        const query = {};
        if (status) query.status = status;
        if (startDate && endDate) {
            query.createAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (month && year) {
            // Lọc theo tháng và năm nếu không có startDate và endDate
            const startOfMonth = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0 (0-11)
            const endOfMonth = new Date(year, month, 0); // Ngày cuối cùng của tháng
            query.createAt = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }

        const orders = await Order.find(query)
            .populate('customer')
            .populate({
                path: 'items.productId',
                populate: {
                    path: 'store',
                },
            });

        res.send(orders); // Trả về toàn bộ danh sách đơn hàng
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy dữ liệu đơn hàng', error: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const { month, year } = req.query;

        let matchQuery = {};
        if (month && year) {
            // Lọc theo tháng và năm
            const startOfMonth = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0 (0-11)
            const endOfMonth = new Date(year, month, 0); // Ngày cuối cùng của tháng
            matchQuery.createAt = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }

        const stats = await Order.aggregate([
            { $match: matchQuery }, // Thêm điều kiện lọc
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.send(stats); // Trả về toàn bộ dữ liệu thống kê
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi thống kê đơn hàng', error: error.message });
    }
});

router.get('/revenue', async (req, res) => {
    try {
        const { type = 'daily', startDate, endDate, month, year } = req.query;

        let matchQuery = {};
        if (startDate && endDate) {
            matchQuery.createAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (month && year) {
            // Lọc theo tháng và năm nếu không có startDate và endDate
            const startOfMonth = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0 (0-11)
            const endOfMonth = new Date(year, month, 0); // Ngày cuối cùng của tháng
            matchQuery.createAt = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }

        let groupBy;
        switch (type) {
            case 'daily':
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createAt' } };
                break;
            case 'monthly':
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createAt' } };
                break;
            case 'byStore':
                groupBy = '$items.store';
                break;
            default:
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createAt' } };
        }

        const revenueData = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: '$items' },
            {
                $group: {
                    _id: groupBy,
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.send(revenueData); // Trả về toàn bộ dữ liệu doanh thu
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi tính toán doanh thu', error: error.message });
    }
});
router.get("/user/:userId", getOrdersByUser);
router.get("/:orderId", getOrderDetail);
export default router;