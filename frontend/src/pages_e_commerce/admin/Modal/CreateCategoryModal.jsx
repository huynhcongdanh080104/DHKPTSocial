import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const CreateCategoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState(null); // State để lưu file ảnh

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file ảnh vào state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Tạo FormData để gửi cả file ảnh và các trường dữ liệu khác
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("productQuantity", formData.productQuantity);
      formDataToSend.append("status", formData.status);
      if (imageFile) {
        formDataToSend.append("image", imageFile); // Thêm file ảnh vào FormData
      }

      // Gọi API để thêm danh mục
      const response = await axios.post("http://localhost:1325/categories/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Đặt header để hỗ trợ upload file
        },
      });

      // Gọi hàm onSubmit từ props để cập nhật danh sách danh mục
      onSubmit(response.data.category);

      // Đóng modal
      onClose();

      // Hiển thị thông báo thành công
      enqueueSnackbar("Thêm danh mục thành công!", { variant: "success" });
    } catch (error) {
      // Xử lý lỗi
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        error.message ||
        "Có lỗi xảy ra!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm Danh Mục Mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên Danh Mục</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mô Tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Số Lượng Sản Phẩm</label>
            <input
              type="number"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Trạng Thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="active">Hoạt Động</option>
              <option value="inactive">Không Hoạt Động</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ảnh Danh Mục</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;