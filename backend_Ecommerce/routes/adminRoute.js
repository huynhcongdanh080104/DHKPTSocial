import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import { Admin } from "../models/adminModel.js";
const router = express.Router();

  const adminSchema = Joi.object({
    username: Joi.string().lowercase().trim().min(3).max(30).required().messages({
      "string.empty": "Tên người dùng không được để trống.",
      "string.min": "Tên người dùng phải có ít nhất 3 ký tự.",
      "string.max": "Tên người dùng không được quá 30 ký tự.",
      "any.required": "Tên người dùng là bắt buộc.",
    }),
    name: Joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Tên không được để trống.",
      "string.min": "Tên phải có ít nhất 3 ký tự.",
      "string.max": "Tên không được quá 50 ký tự.",
      "any.required": "Tên là bắt buộc.",
    }),
    password: Joi.string().trim().min(6).max(30).required().messages({
      "string.empty": "Mật khẩu không được để trống.",
      "string.min": "Mật khẩu phải có ít nhất 6 ký tự.",
      "any.required": "Mật khẩu là bắt buộc.",
    }),
    role: Joi.string().trim().valid("admin", "superadmin").default("admin").messages({
      "any.only": "Vai trò phải là 'admin' hoặc 'superadmin'.",
    }),
    gmail: Joi.string().lowercase().trim().email().required().messages({
      "string.email": "Gmail không hợp lệ.",
      "string.empty": "Gmail không được để trống.",
      "any.required": "Gmail là bắt buộc.",
    }),
    phoneNumber: Joi.string().trim()
      .pattern(/^0\d{9}$/)
      .messages({
        "string.pattern.base": "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.",
      }),
    address: Joi.string().trim().max(100).allow("").messages({
      "string.max": "Địa chỉ không được quá 100 ký tự.",
    }),
    gender: Joi.string().trim().valid("male", "female").allow("").messages({
      "any.only": "Giới tính phải là 'male', 'female'.",
    }),
  });

  // Tạo admin mới
  router.post("/", async (req, res) => {
    try {
      // Kiểm tra dữ liệu đầu vào bằng Joi
      const { error } = adminSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ.",
          errors: error.details.map((err) => err.message),
        });
      }
  
      const { username, name, password, role, gmail, phoneNumber, address, gender } = req.body;
  
      // Kiểm tra username hoặc gmail đã tồn tại chưa
      const existingAdmin = await Admin.findOne({
        $or: [{ username: username }, { gmail: gmail }]
      });
      if (existingAdmin) {
        return res.status(400).json({ message: "Tên đăng nhập hoặc Gmail đã tồn tại." });
      }
  
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo admin mới
      const newAdmin = new Admin({
        username,
        name,
        password: hashedPassword,
        role,
        status: "active",
        gmail,
        phoneNumber,
        address,
        gender,
      });
  
      // Lưu vào database
      await newAdmin.save();
      const { password: _, ...adminData } = newAdmin.toObject();
      res.status(201).json({ message: "Tạo tài khoản admin thành công!", admin: adminData });
    } catch (error) {
      console.error("Lỗi khi tạo admin:", error);
      res.status(500).json({ message: "Lỗi server." });
    }
  });

  // Cập nhật thông tin admin theo id
  router.put("/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, gmail, password } = req.body;
  
      // Lấy thông tin admin hiện tại
      const currentAdmin = await Admin.findById(id);
      if (!currentAdmin) {
        return res.status(404).json({ message: "Không tìm thấy admin." });
      }

      // Kiểm tra xem username hoặc gmail có được gửi lên và có thay đổi không
      const isUsernameChanged = username !== undefined && username !== currentAdmin.username;
      if (isUsernameChanged) {
        console.log("Tên có thay đổi");
      }
  
      const isGmailChanged = gmail !== undefined && gmail !== currentAdmin.gmail;
      if (isGmailChanged) {
        console.log("Email có thay đổi");
      }
  
      // Nếu username hoặc gmail thay đổi, kiểm tra trùng lặp
      if (isUsernameChanged || isGmailChanged) {
        const existingAdmin = await Admin.findOne({
          $or: [
            { username: isUsernameChanged ? username : null }, // Chỉ kiểm tra nếu username thay đổi
            { gmail: isGmailChanged ? gmail : null }, // Chỉ kiểm tra nếu gmail thay đổi
          ],
          _id: { $ne: id }, // Loại trừ admin hiện tại
        });
  
        if (existingAdmin) {
          return res.status(400).json({ message: "Tên đăng nhập hoặc Gmail đã tồn tại." });
        }
      }
  
      // Nếu có mật khẩu mới, mã hóa mật khẩu
      let updateData = { ...req.body };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      } else {
        delete updateData.password; // Không cập nhật mật khẩu nếu không có thay đổi
      }
  
      // Cập nhật thông tin admin
      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedAdmin) {
        return res.status(404).json({ message: "Không tìm thấy admin." });
      }
  
      // Loại bỏ mật khẩu khỏi kết quả trả về
      const { password: _, ...adminData } = updatedAdmin.toObject();
  
      res.status(200).json({
        message: "Cập nhật admin thành công!",
        admin: adminData, // Sử dụng adminData đã được định nghĩa
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật admin:", error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Tên đăng nhập hoặc Gmail đã tồn tại." });
      }
      res.status(500).json({ message: "Lỗi server." });
    }
  });

  // Lấy danh sách tất cả admin
  router.get('/', async (request, response) => {
    try {
      const admins = await Admin.find({}).sort({ name: 1 });
  
      return response.status(200).json({
        count: admins.length,
        data: admins,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách admin:", error.message);
      response.status(500).json({ message: "Lỗi server, vui lòng thử lại sau!" });
    }
  });
  
  //Lấy thông tin admin theo id
  router.get('/:id', async (request, response) => {
    try {
      const { id } = request.params;

      const admin = await Admin.findById(id);

      return response.status(200).json(admin);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  //Xoá admin theo id
  router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      // Kiểm tra xem id có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ message: 'Invalid admin ID' });
      }
  
      // Tìm và xóa admin
      const result = await Admin.findByIdAndDelete(id);
  
      // Nếu không tìm thấy admin
      if (!result) {
        return response.status(404).json({ message: 'Admin not found' });
      }
  
      // Trả về thông báo thành công
      return response.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin:', error.message);
      response.status(500).json({ message: 'Internal server error' });
    }
  });

  //Tìm admin theo username
  router.get('/username/:username', async (request, response) => {
    try {
      const { username } = request.params;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return response.status(404).json({ message: 'Admin not found' });
      }
      response.status(200).json(admin);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

export default router;