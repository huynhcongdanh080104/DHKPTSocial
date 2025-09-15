import React, { useState } from 'react';
import axios from 'axios';

const CreateStoreModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [showManagerSearch, setShowManagerSearch] = useState(false); // State để hiển thị giao diện tìm kiếm
  const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả tìm kiếm
  const [selectedManagers, setSelectedManagers] = useState([]); // State để lưu các quản lý đã chọn trong form chính
  const [selectedManagersForSearch, setSelectedManagersForSearch] = useState([]); // State để lưu các quản lý đã chọn trong quá trình tìm kiếm

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTaxCodeChange = (e) => {
    const { value } = e.target;
    let formattedValue = value.replace(/-/g, ''); // Loại bỏ tất cả dấu "-" trước khi xử lý

    // Nếu độ dài mã số thuế lớn hơn 10, thêm dấu "-" vào vị trí thứ 11
    if (formattedValue.length > 10) {
      formattedValue = `${formattedValue.slice(0, 10)}-${formattedValue.slice(10)}`;
    }

    setFormData({
      ...formData,
      taxCode: formattedValue,
    });
  };

  const addManagerField = () => {
    setShowManagerSearch(true); // Hiển thị giao diện tìm kiếm
    setSearchTerm(''); // Reset từ khóa tìm kiếm
    setSearchResults([]); // Reset danh sách kết quả tìm kiếm
    setSelectedManagersForSearch([]); // Reset selectedManagersForSearch
  };

  const removeManagerField = (index) => {
    const updatedManagers = selectedManagers.filter((_, i) => i !== index);
    setSelectedManagers(updatedManagers);
    setFormData({
      ...formData,
      manager: updatedManagers.map((manager) => manager._id),
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:1325/user?search=${searchTerm}`);
      // Lọc kết quả chỉ dựa trên tên và email
      const filteredResults = response.data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
    }
  };

  const handleSelectManager = (user) => {
    const isSelected = selectedManagersForSearch.some((manager) => manager._id === user._id);
    if (isSelected) {
      setSelectedManagersForSearch(selectedManagersForSearch.filter((manager) => manager._id !== user._id));
    } else {
      setSelectedManagersForSearch([...selectedManagersForSearch, user]);
    }
  };

  const handleConfirmManagers = () => {
    // Thêm selectedManagersForSearch vào selectedManagers, loại bỏ trùng lặp
    const updatedManagers = [...selectedManagers];
    selectedManagersForSearch.forEach((manager) => {
      if (!updatedManagers.some((m) => m._id === manager._id)) {
        updatedManagers.push(manager);
      }
    });
    setSelectedManagers(updatedManagers);

    // Cập nhật formData.manager với các ID của selectedManagers
    setFormData({
      ...formData,
      manager: updatedManagers.map((manager) => manager._id),
    });

    setShowManagerSearch(false); // Ẩn giao diện tìm kiếm
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tên cửa hàng không được để trống
    if (!formData.name || formData.name.trim() === '') {
      alert('Tên cửa hàng không được để trống!');
      return;
    }

    // Loại bỏ dấu "-" và kiểm tra mã số thuế phải có 10 hoặc 13 ký tự
    const taxCodeWithoutDash = formData.taxCode.replace(/-/g, '');
    if (taxCodeWithoutDash.length !== 10 && taxCodeWithoutDash.length !== 13) {
      alert('Mã số thuế phải có 10 hoặc 13 ký tự!');
      return;
    }

    // Lưu mã số thuế chỉ bao gồm số
    const updatedFormData = {
      ...formData,
      taxCode: taxCodeWithoutDash,
    };

    onSubmit(updatedFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-[#008500]/20">
          <div className="flex items-center gap-x-3">
            {/* Hiển thị logo */}
            <img 
              src={formData.logo || '/logo_default.jpg'} 
              alt="Logo cửa hàng" 
              className="w-10 h-10 object-cover rounded-lg border"
            />
            {/* Tiêu đề */}
            <h3 className="text-xl font-bold text-[#008500]">Thêm cửa hàng mới</h3>
          </div>
          {/* Nút đóng */}
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-[#008500] transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              {/* Tên cửa hàng */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Tên cửa hàng</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  maxLength={50} // Giới hạn tối đa 50 ký tự
                />
              </div>

              {/* Mô tả */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={100} // Giới hạn tối đa 100 ký tự
                />
              </div>

              {/* Địa chỉ */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Mã số thuế */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Mã số thuế</label>
                <input
                  type="text"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleTaxCodeChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  maxLength={14} // Giới hạn tối đa 14 ký tự (bao gồm dấu "-")
                />
              </div>

              {/* Quản lý (Manager) */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Người quản lí</label>
                  <button
                    type="button"
                    onClick={addManagerField}
                    className="text-sm text-[#008500] hover:text-[#006600]"
                  >
                    ➕ Thêm người quản lý
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {selectedManagers.length > 0 ? (
                    selectedManagers.map((manager, index) => (
                      <div
                        key={manager._id}
                        className="flex items-center justify-between gap-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-x-3">
                          <span className="text-sm text-gray-800">{index + 1}.</span>
                          <p className="text-sm font-medium text-gray-800">{manager.name}</p>
                          <p className="text-xs text-gray-600">{manager.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeManagerField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">Chưa thêm người quản lí</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center text-sm mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 bg-[#008500] text-white rounded-md hover:bg-[#006600] transition-colors flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Lưu
          </button>
        </div>
      </div>

      {/* Giao diện tìm kiếm người quản lý */}
      {showManagerSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-[#008500]/20">
              <h3 className="text-xl font-bold text-[#008500]">Thêm người quản lý</h3>
              <button 
                onClick={() => setShowManagerSearch(false)}
                className="text-gray-500 hover:text-[#008500] transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tìm kiếm theo tên hoặc email"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#008500] text-white rounded-lg hover:bg-[#006600] transition-colors"
              >
                🔍
              </button>
            </div>

            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedManagersForSearch.some((manager) => manager._id === user._id)}
                    onChange={() => handleSelectManager(user)}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-x-3">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmManagers}
                className="px-4 py-2 bg-[#008500] text-white rounded-lg hover:bg-[#006600] transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStoreModal;