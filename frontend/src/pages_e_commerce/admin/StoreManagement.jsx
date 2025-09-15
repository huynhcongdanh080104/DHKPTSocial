import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Clock from "../components/Clock";
import { useSnackbar } from 'notistack';
import Pagination from "../components/Pagination";
import ViewStoreModal from "./Modal/ViewStoreModal";
import CreateStoreModal from "./Modal/CreateStoreModal";
import EditStoreModal from "./Modal/EditStoreModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const filtersSectionRef = useRef(null);
  const [ratingFilter, setRatingFilter] = useState("");

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    address: '',
    taxCode: '',
    logo: '',
    manager: []
  });

  const [selectedStoreForEdit, setSelectedStoreForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

// API gọi lấy dữ liệu tất cả store
useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await axios.get("https://dhkshop.onrender.com/store");
      console.log("Toàn bộ response từ API:", response); // In ra toàn bộ response để kiểm tra
      const storesData = Array.isArray(response.data) ? response.data : []; // Sửa lại thành response.data
      setStores(storesData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách store:", error);
      setError("Lỗi tải dữ liệu. Vui lòng thử lại sau.");
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchStores();
}, []);

  // Lưu checkbox vào localStorage
  const [selectedStores, setSelectedStores] = useState(() => {
    const saved = localStorage.getItem("selectedStores");
    return saved ? JSON.parse(saved) : [];
  });

  // Xử lý checkbox
  const handleCheckboxChange = (storeId) => {
    setSelectedStores((prev) => {
      const updated = prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId];
      localStorage.setItem("selectedStores", JSON.stringify(updated));
      return updated;
    });
  };

  // Lọc danh sách store dựa vào bộ lọc
  const filteredStores = stores.filter(store => {
    if (!store || !store.name) return false; // Kiểm tra nếu store hoặc store.name là undefined
    const matchesSearch = [store.name, store.address, store.taxCode].some(
      field => String(field).toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    const matchesStatus = statusFilter === "" || store.status === statusFilter;
    let matchesRating = true;
    if (ratingFilter) {
      const [min, max] = ratingFilter.split("-");
      if (max) {
        matchesRating = store.rating >= parseFloat(min) && store.rating < parseFloat(max);
      } else {
        matchesRating = store.rating >= 4;
      }
    }
    return matchesSearch && matchesStatus && matchesRating;
  });

  // Tính toán số lượng hiển thị
  const availableOptions = [10, 20, 30].filter(num => num <= filteredStores.length);
  if (filteredStores.length > 0 && !availableOptions.includes(filteredStores.length)) {
    availableOptions.push(filteredStores.length);
  }

  // Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Tính toán phân trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredStores.length / displayCount);
  const startIndex = (currentPage - 1) * displayCount;
  const currentStores = displayCount === filteredStores.length
    ? filteredStores
    : filteredStores.slice(startIndex, startIndex + displayCount);

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

  // Xử lý mở modal khi xem thông tin store
  const handleViewStore = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  // Hàm xử lý thêm store
  const handleAddStore = async (storeData) => {
    try {
      const response = await axios.post('https://dhkshop.onrender.com/store', storeData);
      console.log("Response from API after adding store:", response.data); // Kiểm tra dữ liệu trả về
      setStores(prev => [...prev, response.data]);
      setNewStore({
        name: '',
        description: '',
        address: '',
        taxCode: '',
        logo: '',
        manager: []
      });
      enqueueSnackbar('Thêm store thành công!', { variant: 'success' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Hàm xử lý sửa store
  const handleEditStore = async (storeData) => {
    try {
      const response = await axios.put(`https://dhkshop.onrender.com/store/${storeData._id}`, storeData);
      
      // Cập nhật lại danh sách stores
      setStores((prevStores) =>
        prevStores.map((store) =>
          store._id === storeData._id ? response.data : store // response.data là dữ liệu cửa hàng đã được cập nhật từ API
        )
      );
  
      enqueueSnackbar('Cập nhật cửa hàng thành công!', { variant: 'success' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Hàm xử lý xóa store
  const handleDeleteStore = async (storeId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa store này không?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://dhkshop.onrender.com/store/${storeId}`);
      setStores(prev => prev.filter(store => store._id !== storeId));
      enqueueSnackbar('Xóa store thành công!', { variant: 'success' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Hàm xử lý xóa nhiều store
  const handleDeleteAllSelected = async () => {
    // Kiểm tra nếu không có store nào được chọn
    if (selectedStores.length === 0) {
      enqueueSnackbar("Vui lòng chọn ít nhất một cửa hàng để xóa!", { variant: "warning" });
      return;
    }
  
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedStores.length} cửa hàng đã chọn không?`
    );
  
    // Nếu người dùng không xác nhận, thoát khỏi hàm
    if (!isConfirmed) return;
  
    try {
      let deletedStores = []; // Danh sách store đã xóa thành công
      let notFoundStores = []; // Danh sách store không tồn tại
  
      // Duyệt qua từng store đã chọn và gọi API xóa
      for (const storeId of selectedStores) {
        try {
          await axios.delete(`https://dhkshop.onrender.com/store/${storeId}`);
          deletedStores.push(storeId); // Thêm vào danh sách đã xóa thành công
        } catch (error) {
          if (error.response?.status === 404) {
            notFoundStores.push(storeId); // Store không tồn tại
          } else {
            throw error; // Nếu có lỗi khác, hiển thị thông báo lỗi
          }
        }
      }
  
      // Cập nhật danh sách store trên frontend
      setStores((prev) =>
        prev.filter(
          (store) =>
            !deletedStores.includes(store._id) && !notFoundStores.includes(store._id)
      ))
  
      // Cập nhật danh sách đã chọn
      const updatedSelectedStores = selectedStores.filter(
        (id) => !deletedStores.includes(id) && !notFoundStores.includes(id)
      );
      setSelectedStores(updatedSelectedStores);
      localStorage.setItem("selectedStores", JSON.stringify(updatedSelectedStores));
  
      // Hiển thị thông báo kết quả
      if (deletedStores.length > 0) {
        enqueueSnackbar(`Đã xóa ${deletedStores.length} cửa hàng thành công!`, {
          variant: "success",
        });
      }
      if (notFoundStores.length > 0) {
        enqueueSnackbar(
          `${notFoundStores.length} cửa hàng không tồn tại và đã bị loại khỏi danh sách.`,
          { variant: "warning" }
        );
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        error.message ||
        "Có lỗi xảy ra!";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  //Copy
  const handleCopyTableData = () => {
    // Chuyển dữ liệu từ bảng thành chuỗi CSV
    const headers = ["Tên cửa hàng", "Địa chỉ", "Mô tả", "Mã số thuế", "Xếp hạng", "Ngày thành lập", "Trạng thái"];
    const rows = currentStores.map(store => [
      store.name,
      store.address || "Chưa cập nhật",
      store.description || "Chưa cập nhật",
      store.taxCode,
      store.rating,
      store.publishDate,
      store.status === "active" ? "Hoạt động" : "Đã bị khoá"
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
  const exportToExcel = (currentStores) => {
    if (currentStores.length === 0) {
      enqueueSnackbar("Không có dữ liệu để xuất!", { variant: "warning" });
      return;
    }

    const data = currentStores.map(store => ({
      "Tên cửa hàng" : store.name,
      "Địa chỉ" :store.address || "Chưa cập nhật",
      "Mô tả" : store.description || "Chưa cập nhật",
      "Mã số thuế" : store.taxCode,
      "Xếp hạng" : store.rating,
      "Ngày thành lập" : store.publishDate,
      "Trạng thái" : store.status === "active" ? "Hoạt động" : "Đã bị khoá"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách Store");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(excelFile, "Danh_sach_cua_hang.xlsx");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 bg-white pl-3 border-l-4 border-[#008500] h-9 flex items-center rounded-lg justify-between pr-3">
        Danh sách cửa hàng
        <Clock />
      </h2>

      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
            onClick={() => setIsAddModalOpen(true)}
          >
            ➕ Thêm cửa hàng mới
          </button>
          <button 
            className="bg-indigo-400 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            onClick={handleCopyTableData}
          >
            📋 Sao chép
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            onClick={exportToExcel}
          >
            📊 Xuất Excel
          </button>
          {selectedStores.length > 0 && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              onClick={handleDeleteAllSelected}
            >
              ❌ Xóa tất cả
            </button>
          )}
        </div>

        <hr ref={filtersSectionRef} className="my-4 border-gray-300 border-t-2" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {/* Ô tìm kiếm */}
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              onClick={handleScroll}
              placeholder="Tìm theo tên, địa chỉ hoặc mã số thuế..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bộ lọc xếp hạng */}
          <div className="flex items-center gap-2">
            <span className="font-semibold whitespace-nowrap">Xếp hạng:</span>
            <select
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="0-1">Từ 0 tới dưới 1</option>
              <option value="1-2">Từ 1 tới dưới 2</option>
              <option value="2-3">Từ 2 tới dưới 3</option>
              <option value="3-4">Từ 3 tới dưới 4</option>
              <option value="4+">Trên 4</option>
            </select>
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
                  {num === filteredStores.length ? "Tất cả" : num}
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
                <th className="border-t border-b border-gray-300 p-2">Tên cửa hàng</th>
                <th className="border-t border-b border-gray-300 p-2">Địa chỉ</th>
                <th className="border-t border-b border-gray-300 p-2">Mã số thuế</th>
                <th className="border-t border-b border-gray-300 p-2">Xếp hạng</th>
                <th className="border-t border-b border-gray-300 p-2">
                  <select
                    className="w-full p-1 bg-white border rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="Active">Hoạt động</option>
                    <option value="banned">Đã bị khoá</option>
                  </select>
                </th>
                <th className="border-t border-b border-gray-300 p-2">Các chức năng</th>
              </tr>
            </thead>
            <tbody>
              {currentStores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
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
                      Không tìm thấy store nào phù hợp
                    </div>
                  </td>
                </tr>
              ) : (
                currentStores.map((store, index) => (
                  <tr key={store._id} className="border-t border-b border-gray-300">
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store._id)}
                        onChange={() => handleCheckboxChange(store._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={store.name}
                        onClick={() => handleViewStore(store)}
                      >
                        {store.name.length > 25 ? store.name.slice(0, 25) + "..." : store.name}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={store.address || "Chưa cập nhật"} // Hiển thị "Chưa cập nhật" khi address rỗng
                      >
                        {store.address ? (
                          store.address.length > 20 ? store.address.slice(0, 20) + "..." : store.address
                        ) : (
                          <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800 font-medium">
                            Chưa cập nhật
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {store.taxCode.length > 10
                        ? `${store.taxCode.slice(0, 10)} - ${store.taxCode.slice(10)}`
                        : store.taxCode
                      }
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {store.rating.toFixed(1)}
                    </td>
                    <td className={`border-t border-b border-gray-300 p-2 text-center font-medium
                        ${store.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}
                      `}
                    >
                      {store.status === "Active" ? "Hoạt động" : "Đã bị khoá"}
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center space-x-2">
                      <button onClick={() => handleViewStore(store)}>
                        👁
                      </button>
                      <button onClick={() => {
                        setSelectedStoreForEdit(store);
                        setIsEditModalOpen(true);
                      }}>
                        ✎
                      </button>
                      <button onClick={() => handleDeleteStore(store._id)}>
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
          <ViewStoreModal
            store={selectedStore}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isAddModalOpen && (
          <CreateStoreModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddStore}
            initialData={newStore}
          />
        )}
        {isEditModalOpen && (
          <EditStoreModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditStore}
            initialData={selectedStoreForEdit}
          />
        )}
        {totalPages > 1 && displayCount < filteredStores.length && (
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

export default StoreManagement;