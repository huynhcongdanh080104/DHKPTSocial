import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Clock from "../components/Clock";
import Pagination from "../components/Pagination";
//import ViewCategoryModal from "./Modal/ViewCategoryModal";
import { useSnackbar } from 'notistack';
//import CreateCategoryModal from "./Modal/CreateCategoryModal";
//import EditCategoryModal from "./Modal/EditCategoryModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const filtersSectionRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    productQuantity: 0,
    status: 'active'
  });

  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // Lưu checkbox vào localStorage
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem("selectedCategories");
    return saved ? JSON.parse(saved) : [];
  });

  // Xử lý checkbox
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId];
      localStorage.setItem("selectedCategories", JSON.stringify(updated));
      return updated;
    });
  };

  // API gọi lấy dữ liệu tất cả danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://dhkshop.onrender.com/categories");
        // Validate data từ API
        const validatedCategories = response.data.map(category => ({
          ...category,
          status: ["active", "inactive"].includes(category.status) ? category.status : "active"
        }));
        setCategories(validatedCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        setError("Lỗi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Lọc danh sách danh mục dựa vào bộ lọc
  const filteredCategories = categories.filter(category => {
    const matchesSearch = [category.name, category.description].some(
      field => String(field).toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    
    return (
      matchesSearch &&
      (statusFilter === "" || category.status === statusFilter)
    );
  });

  // Tính toán số lượng hiển thị
  const availableOptions = [10, 20, 30].filter(num => num <= filteredCategories.length);
  if (filteredCategories.length > 0 && !availableOptions.includes(filteredCategories.length)) {
    availableOptions.push(filteredCategories.length);
  }

  // Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Tính toán phân trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredCategories.length / displayCount);
  const startIndex = (currentPage - 1) * displayCount;
  const currentCategories = displayCount === filteredCategories.length 
    ? filteredCategories 
    : filteredCategories.slice(startIndex, startIndex + displayCount);

  // Hiển thị loading và error
  if (isLoading) return <div className="text-center p-8">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  // Xử lý cuộn màn hình
  const handleScroll = () => {
    if (filtersSectionRef.current) {
      filtersSectionRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Xử lý mở modal khi xem thông tin danh mục
  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Hàm xử lý thêm danh mục
  const handleAddCategory = async (categoryData) => {
    try {
      // Thêm danh mục mới vào danh sách
      setCategories((prev) => [...prev, categoryData]);
  
      // Reset form
      setNewCategory({
        name: "",
        description: "",
        image: "",
        productQuantity: 0,
        status: "active",
      });
  
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

  // Hàm xử lý sửa danh mục
  const handleEditCategory = async (categoryData) => {
    try {
      const response = await axios.put(`https://dhkshop.onrender.com/categories/edit/${categoryData._id}`, categoryData);
      
      if (!response.data?.category) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
  
      // Cập nhật danh sách danh mục
      setCategories(prev => prev.map(category => 
        category._id === categoryData._id ? response.data.category : category
      ));
  
      enqueueSnackbar('Cập nhật danh mục thành công!', { variant: 'success' });
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  };

  // Hàm xử lý xóa danh mục
  const handleDeleteCategory = async (categoryId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?");
    if (!isConfirmed) return;
  
    try {
      // Gọi API xóa danh mục
      await axios.delete(`https://dhkshop.onrender.com/categories/${categoryId}`);
  
      // Cập nhật danh sách danh mục sau khi xóa
      setCategories(prev => prev.filter(category => category._id !== categoryId));
  
      // Hiển thị thông báo thành công
      enqueueSnackbar('Xóa danh mục thành công!', { variant: 'success' });
    } catch (error) {
      // Xử lý lỗi
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Hàm xử lý xóa nhiều danh mục
  const handleDeleteAllSelected = async () => {
    if (selectedCategories.length === 0) {
      enqueueSnackbar("Vui lòng chọn ít nhất một danh mục để xóa!", { variant: "warning" });
      return;
    }

    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn không?`);
    if (!isConfirmed) return;

    try {
      let deletedCategories = []; // Danh sách danh mục đã xóa thành công
      let notFoundCategories = []; // Danh sách danh mục không tồn tại

      // Duyệt qua từng danh mục đã chọn và gọi API xóa
      for (const categoryId of selectedCategories) {
        try {
          await axios.delete(`https://dhkshop.onrender.com/categories/${categoryId}`);
          deletedCategories.push(categoryId); // Thêm vào danh sách đã xóa thành công
        } catch (error) {
          if (error.response?.status === 404) {
            notFoundCategories.push(categoryId); // Danh mục không tồn tại
          } else {
            throw error; // Nếu có lỗi khác, hiển thị thông báo lỗi
          }
        }
      }

      // Cập nhật danh sách danh mục trên frontend
      setCategories(prev => prev.filter(category => 
        !deletedCategories.includes(category._id) && !notFoundCategories.includes(category._id)
      ));

      // Cập nhật danh sách đã chọn
      const updatedSelectedCategories = selectedCategories.filter(
        id => !deletedCategories.includes(id) && !notFoundCategories.includes(id)
      );
      setSelectedCategories(updatedSelectedCategories);
      localStorage.setItem("selectedCategories", JSON.stringify(updatedSelectedCategories));

      // Hiển thị thông báo kết quả
      if (deletedCategories.length > 0) {
        enqueueSnackbar(`Đã xóa ${deletedCategories.length} danh mục thành công!`, { variant: "success" });
      }
      if (notFoundCategories.length > 0) {
        enqueueSnackbar(`${notFoundCategories.length} danh mục không tồn tại và đã bị loại khỏi danh sách.`, { variant: "warning" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // Sao chép dữ liệu
  const handleCopyTableData = () => {
    // Chuyển dữ liệu từ bảng thành chuỗi CSV
    const headers = ["Tên danh mục", "Mô tả", "Số lượng sản phẩm", "Trạng thái"];
    const rows = currentCategories.map(category => [
      category.name,
      category.description,
      category.productQuantity,
      category.status === "active" ? "Hoạt động" : "Không hoạt động"
    ]);
  
    const csvContent = [
      headers.join(","), // Header
      ...rows.map(row => row.join(",")) // Dữ liệu
    ].join("\n");
  
    // Sao chép vào clipboard
    navigator.clipboard.writeText(csvContent)
      .then(() => {
        enqueueSnackbar("Đã sao chép dữ liệu vào clipboard!", { variant: "success" });
  
        // Hiển thị hướng dẫn cách tách dữ liệu
        const isConfirmed = window.confirm(
          "Dữ liệu đã được sao chép vào clipboard!\n\n" +
          "Để tách dữ liệu trong Excel hoặc Google Sheets:\n" +
          "1. Dán dữ liệu vào một ô.\n" +
          "2. Chọn ô đó, sau đó vào menu 'Dữ liệu' (Data).\n" +
          "3. Chọn Delimited rồi Next.\n" +
          "4. Nhập dấu phẩy (,) vào mục Other rồi nhấn Finish.\n\n" +
          "Bạn có muốn mở hướng dẫn chi tiết không?"
        );
  
        if (isConfirmed) {
          window.open("https://support.google.com/docs/answer/6325535", "_blank");
        }
      })
      .catch(() => {
        enqueueSnackbar("Không thể sao chép dữ liệu!", { variant: "error" });
      });
  };

  // Xuất file Excel
  const exportToExcel = (categories) => {
    if (categories.length === 0) {
      enqueueSnackbar("Không có dữ liệu để xuất!", { variant: "warning" });
      return;
    }
  
    // 1. Chuẩn bị dữ liệu dưới dạng mảng JSON
    const data = categories.map(category => ({
      "Tên danh mục": category.name,
      "Mô tả": category.description,
      "Số lượng sản phẩm": category.productQuantity,
      "Trạng thái": category.status === "active" ? "Hoạt động" : "Không hoạt động"
    }));
  
    // 2. Chuyển dữ liệu thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // 3. Tạo workbook và thêm worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách Danh mục");
  
    // 4. Xuất file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // 5. Lưu file
    saveAs(excelFile, "Danh_sach_Danh_muc.xlsx");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 bg-white pl-3 border-l-4 border-[#008500] h-9 flex items-center rounded-lg justify-between pr-3">
        Danh sách Danh mục
        <Clock />
      </h2>
      
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex gap-2 flex-wrap">
          <button 
            className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
            /*onClick={() => setIsAddModalOpen(true)}*/
          >
            ➕ Thêm danh mục mới
          </button>
          <button 
            className="bg-indigo-400 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            onClick={handleCopyTableData}
          >
            📋 Sao chép
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            onClick={() => exportToExcel(categories)}
          >
            📊 Xuất Excel
          </button>
          {selectedCategories.length > 0 && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              onClick={handleDeleteAllSelected}
            >
              ❌ Xóa tất cả
            </button>
          )}
        </div>

        <hr ref={filtersSectionRef} className="my-4 border-gray-300 border-t-2" />

        <div  className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {/* Ô tìm kiếm */}
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              onClick={handleScroll}
              placeholder="Tìm theo tên hoặc mô tả..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Phần hiển thị số lượng */}
          <div className="flex items-center gap-2">
            <span className="font-semibold whitespace-nowrap">Hiển thị:</span>
            <select
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={displayCount}
              onClick={handleScroll}
              onChange={(e) => {
                setDisplayCount(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {availableOptions.map((num) => (
                <option key={num} value={num}>
                  {num === filteredCategories.length ? "Tất cả" : num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border-l-4 border-r-4 border-[#008500]">
          <table className="w-full border-collapse border-t border-b border-gray-300 border-x-0">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-t border-b border-gray-300 p-2"></th>
                <th className="border-t border-b border-gray-300 p-2">Tên danh mục</th>
                <th className="border-t border-b border-gray-300 p-2">Mô tả</th>
                <th className="border-t border-b border-gray-300 p-2">Số lượng sản phẩm</th>
                <th className="border-t border-b border-gray-300 p-2">
                  <select 
                    className="w-full p-1 bg-white border rounded" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </th>
                <th className="border-t border-b border-gray-300 p-2">Các chức năng</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    <div className="flex flex-col items-center py-6">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Không tìm thấy danh mục nào phù hợp
                    </div>
                  </td>
                </tr>
              ) : (
                currentCategories.map((category, index) => (
                  <tr key={category._id} className="border-t border-b border-gray-300">
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCheckboxChange(category._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={category.name}
                        /*onClick={() => handleViewCategory(category)}*/
                      >
                        {category.name.length > 20 ? category.name.slice(0, 20) + "..." : category.name}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={category.description}
                      >
                        {category.description.length > 20 ? category.description.slice(0, 20) + "..." : category.description}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {category.productQuantity}
                    </td>
                    <td className={`border-t border-b border-gray-300 p-2 text-center font-medium
                        ${category.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}
                      `}
                    >
                      {category.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center space-x-2">
                    <button 
                      /*onClick={() => handleViewCategory(category)}*/
                    >
                      👁
                    </button>
                    <button 
                      /*onClick={() => {
                        setSelectedCategoryForEdit(category);
                        setIsEditModalOpen(true);
                      }}*/
                    >
                      ✎
                    </button>
                    <button 
                      /*onClick={() => handleDeleteCategory(category._id)}*/
                    >
                      🗑
                    </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <ViewCategoryModal 
            category={selectedCategory} 
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isAddModalOpen && (
          <CreateCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddCategory}
            initialData={newCategory}
          />
        )}
        {isEditModalOpen && (
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditCategory}
            initialData={selectedCategoryForEdit}
          />
        )}
        {totalPages > 1 && displayCount < filteredCategories.length && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>  
  );
};

export default CategoryManagement;