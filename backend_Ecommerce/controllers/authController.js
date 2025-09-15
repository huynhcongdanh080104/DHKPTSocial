import {Shipper} from '../models/shipperModel.js'; // Import đúng model shipper bạn đã có

export const loginShipper = async (req, res) => {
  const { username, password } = req.body;

  try {
    const shipper = await Shipper.findOne({ username });

    if (!shipper || shipper.password !== password) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    if (shipper.status === 'Banned') {
      return res.status(403).json({ message: 'Tài khoản bị khóa' });
    }

    // Nếu không dùng JWT, bạn có thể tạo token giả
    const token = `token-${shipper._id}-${Date.now()}`;

    res.status(200).json({
      token,
      shipper,
    });
  } catch (error) {
    console.error('Lỗi đăng nhập shipper:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
