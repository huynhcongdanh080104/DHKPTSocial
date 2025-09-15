import React, { useState } from 'react';
import * as yup from 'yup';

// Định nghĩa schema validation bằng yup
const adminSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(30, "Tên người dùng không được quá 30 ký tự")
    .required("Tên người dùng là bắt buộc"),
    
  name: yup
    .string()
    .min(3, "Tên phải có ít nhất 3 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .required("Tên là bắt buộc"),
    
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    
  role: yup
    .string()
    .oneOf(["admin", "superadmin"], "Vai trò không hợp lệ")
    .default("admin"),
    
  gmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),
    
  phoneNumber: yup
    .string()
    .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"),
    
  address: yup
    .string()
    .max(100, "Địa chỉ không được quá 100 ký tự"),
    
  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Giới tính không hợp lệ")
});

const EditAdminModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate dữ liệu trước khi submit
      await adminSchema.validate(formData, { abortEarly: false });

      // Nếu dữ liệu hợp lệ, gọi hàm onSubmit
      onSubmit(formData);
      onClose();
      // Reset lỗi nếu có
      setErrors({});
    } catch (validationErrors) {
      // Xử lý lỗi validation
      const errors = {};
      validationErrors.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setErrors(errors);
    }
  };

  // Hàm chuyển đổi hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#008500]/20">
          <h3 className="text-2xl font-bold text-[#008500]">Chỉnh sửa Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-[#008500] transition-colors p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Cột 1 */}
            <div className="space-y-4">
              {/* Tên người dùng */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên người dùng</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.toLowerCase();
                    value = value.replace(/[^a-z0-9]/g, "");
                    if (value.length > 30) {
                      value = value.slice(0, 30);
                    }
                    e.target.value = value;
                    handleChange(e);
                  }}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>

              {/* Họ và tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 50) {
                      value = value.slice(0, 50);
                    }
                    e.target.value = value;
                    handleChange(e);
                  }}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.toLowerCase();
                      value = value.replace(/[^a-z0-9]/g, "");
                      if (value.length > 30) {
                        value = value.slice(0, 30);
                      }
                      e.target.value = value;
                      handleChange(e);
                    }}
                    className="mt-1 p-2 w-full border rounded-lg"
                    placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-3 py-2 flex items-center"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Vai trò */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              {/* Gmail */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gmail</label>
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
                {errors.gmail && <p className="text-red-500 text-sm">{errors.gmail}</p>}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    e.target.value = value;
                    handleChange(e);
                  }}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 100) {
                      value = value.slice(0, 100);
                    }
                    e.target.value = value;
                    handleChange(e);
                  }}
                  className="mt-1 p-2 w-full border rounded-lg"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#008500] text-white rounded-lg hover:bg-[#006600] transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;