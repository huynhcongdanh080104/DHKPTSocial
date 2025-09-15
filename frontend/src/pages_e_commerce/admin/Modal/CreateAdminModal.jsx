import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

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
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
    
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

const CreateAdminModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = async () => {
    try {
      await adminSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Thêm autoComplete để chống tự động điền
  const getAutoComplete = (fieldName) => {
    if (fieldName === 'password') return 'new-password'
    if (fieldName === 'gmail') return 'off'
    return 'on'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;
  
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      //enqueueSnackbar(error.message || 'Có lỗi xảy ra!', { variant: 'error' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl mx-4 shadow-2xl border-2 border-[#008500]/20"> {/* Đổi max-w-md thành max-w-4xl */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#008500]">Thêm Admin Mới</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#008500] transition-colors text-2xl"
          >
            ✕
          </button>
        </div>
  
        {/* Thêm container grid và scroll */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Thêm grid container */}
            
            {/* Cột trái */}
            <div className="space-y-5">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập *</label>
                <input
                  autoComplete="username"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                  } transition-all`}
                  value={formData.username}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.toLowerCase();
                    value = value.replace(/[^a-z0-9]/g, "");
                    if (value.length > 30) {
                      value = value.slice(0, 30);
                    }
                    e.target.value = value;
                    handleChange('username', e.target.value)
                  }}
                  placeholder="Nhập tên đăng nhập..."
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>
  
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
                <input
                  autoComplete="name"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                  } transition-all`}
                  value={formData.name}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 50) {
                      value = value.slice(0, 50);
                    }
                    e.target.value = value;
                    handleChange('name', e.target.value)
                  }}
                  placeholder="Nhập họ và tên..."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
  
              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
                <div className="relative">
                  <input
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"} // Thay đổi kiểu input
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                    } transition-all`}
                    value={formData.password}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.toLowerCase();
                      value = value.replace(/[^a-z0-9]/g, "");
                      if (value.length > 30) {
                        value = value.slice(0, 30);
                      }
                      e.target.value = value;
                      handleChange('password', e.target.value);
                    }}
                    placeholder="Nhập mật khẩu..."
                  />
                  {/* Nút hình mắt */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
  
              {/* Gmail */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  autoComplete="email"
                  type="email"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.gmail 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                  } transition-all`}
                  value={formData.gmail}
                  onChange={(e) => handleChange('gmail', e.target.value)}
                  placeholder="abc@gmail.com"
                />
                {errors.gmail && <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>}
              </div>
            </div>
  
            {/* Cột phải */}
            <div className="space-y-5">
              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  autoComplete="tel"
                  type="tel"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.phoneNumber 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                  } transition-all`}
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^0-9]/g, "");
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    e.target.value = value;
                    handleChange('phoneNumber', e.target.value)
                  }}
                  placeholder="0123 456 789"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
  
              {/* Address */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  autoComplete="address-line1"
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.address 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                  } transition-all`}
                  value={formData.address}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 100) {
                      value = value.slice(0, 100);
                    }
                    e.target.value = value;
                    handleChange('address', e.target.value)
                  }}
                  placeholder="Nhập địa chỉ..."
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
  
              {/* Role và Gender */}
              <div className="grid grid-cols-1 gap-4">
                {/* Role */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Vai trò *</label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.role 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                    } transition-all bg-white`}
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
  
                {/* Gender */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.gender 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#008500] focus:ring-[#008500]'
                    } transition-all bg-white`}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
              </div>
            </div>
          </div>
  
          {/* Nút submit */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#008500] text-white hover:bg-[#006700] transition-colors shadow-md"
            >
              Thêm Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;