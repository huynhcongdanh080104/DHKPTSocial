import {Shipper} from "../models/shipperModel.js";
import {Warehouse} from "../models/warehouseModel.js"
// Đăng nhập Shipper (so username và password thuần)
export const loginShipper = async (req, res) => {
  const { username, password } = req.body;

  try {
    const shipper = await Shipper.findOne({ username, password });
    if (!shipper) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    res.status(200).json({
      message: "Đăng nhập thành công",
      shipper,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy danh sách shipper (tùy chọn lọc theo role hoặc status)
export const getAllShippers = async (req, res) => {
  const { role, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  try {
    const shippers = await Shipper.find(filter);
    res.status(200).json(shippers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Cập nhật trạng thái giao hàng (deliveryStatus: available, delivering, off)
export const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;

  if (!['available', 'delivering', 'off'].includes(deliveryStatus)) {
    return res.status(400).json({ message: "deliveryStatus không hợp lệ" });
  }

  try {
    const shipper = await Shipper.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    );
    if (!shipper) {
      return res.status(404).json({ message: "Không tìm thấy shipper" });
    }

    res.status(200).json({ message: "Cập nhật thành công", shipper });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Thêm shipper mới
export const createShipper = async (req, res) => {
  const data = req.body;

  try {
    const newShipper = new Shipper(data);
    await newShipper.save();
    res.status(201).json({ message: "Tạo shipper thành công", shipper: newShipper });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo shipper", error: err.message });
  }
};
export const getFreeShipper = async (req, res) => {
  try{
    const {province} = req.params;
    if (!province) {
      return res.status(400).json({ success: false, message: "Province is required" });
    }
    const warehouses = await Warehouse.findOne({ "location.province": province });
    const shipper = await Shipper.findOne({ deliveryStatus: { $in: ["available", "delivering"] }, role: "shipper", assignedWarehouse: warehouses._id }).sort({ status: 1 }).populate('assignedWarehouse');
    res.json({ success: true, data: shipper });
  }
  catch (error){
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

// Lấy thông tin shipper từ cookie
export const getShipperProfile = async (req, res) => {
  try {
    const {shipperId} = req.params;
    const shipper = await Shipper.findById(shipperId).select('-password');
    if (!shipper) return res.status(404).json({ message: 'Không tìm thấy shipper' });
    res.json(shipper);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Cập nhật trạng thái shipper
export const updateShipperStatus = async (req, res) => {
  const {shipperId} = req.params;
  const { status } = req.body;
  if (!['idle', 'delivering', 'off'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const shipper = await Shipper.findByIdAndUpdate(
      shipperId,
      { status },
      { new: true }
    ).select('-password');

    if (!shipper) return res.status(404).json({ message: 'Không tìm thấy shipper' });

    res.json({ message: 'Cập nhật trạng thái thành công', status: shipper.status });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
//Lấy đơn hàng shipper đã nhận
export const getShipperOrders = async (req, res) => {
  try {
    const shipperId = req.user.id; // lấy từ token
    const orders = await Order.find({ assignedShipper: shipperId }); // hoặc shipping collection nếu dùng
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};
// Lấy danh sách đơn hàng chưa có shipper nhận
export const getWarehouseOrders = async (req, res) => {
  try {
    const orders = await Order.find({ shipper: null }) // Đơn chưa gán shipper
      .select('_id recipientName recipientAddress')    // Lấy trường cần hiển thị
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng từ kho' });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token' });

    // 👉 Nếu không dùng JWT: token là shipperId (lúc login lưu vào cookie)
    const shipperId = token;

    const shipper = await Shipper.findById(shipperId);
    if (!shipper) return res.status(404).json({ message: 'Shipper không tồn tại' });

    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

    if (order.shipper) {
      return res.status(400).json({ message: 'Đơn hàng đã được nhận' });
    }

    // Gán shipper vào đơn hàng
    order.shipper = shipper._id;
    order.status = 'Đã được nhận giao'; // Hoặc status phù hợp
    await order.save();

    res.status(200).json({ message: 'Nhận đơn thành công' });
  } catch (err) {
    console.error('Lỗi khi shipper nhận đơn:', err);
    res.status(500).json({ message: 'Lỗi server khi nhận đơn' });
  }
};