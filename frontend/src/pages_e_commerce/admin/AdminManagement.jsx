import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Clock from "../components/Clock";
import Pagination from "../components/Pagination";
import ViewAdminModal from "./Modal/ViewAdminModal";
import { useSnackbar } from 'notistack';
import CreateAdminModal from "./Modal/CreateAdminModal";
import EditAdminModal from "./Modal/EditAdminModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const filtersSectionRef = useRef(null);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    name: '',
    password: '',
    role: 'admin',
    gmail: '',
    phoneNumber: '',
    address: '',
    gender: 'male'
  });

  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  //API gọi lấy dữ liệu tất cả admin
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("https://dhkshop.onrender.com/admins");
        // Validate data từ API
        const validatedAdmins = response.data.data.map(admin => ({
          ...admin,
          role: ["admin", "superadmin"].includes(admin.role) ? admin.role : "admin",
          status: ["active", "banned"].includes(admin.status) ? admin.status : "active",
          gender: ["male", "female"].includes(admin.gender) ? admin.gender : "other"
        }));
        setAdmins(validatedAdmins);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách admin:", error);
        setError("Lỗi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdmins();
  }, []);

  //Lưu checkbox vào localStorage
  const [selectedAdmins, setSelectedAdmins] = useState(() => {
    const saved = localStorage.getItem("selectedAdmins");
    return saved ? JSON.parse(saved) : [];
  });

  // Xử lý checkbox
  const handleCheckboxChange = (adminId) => {
    setSelectedAdmins((prev) => {
      const updated = prev.includes(adminId) 
        ? prev.filter(id => id !== adminId) 
        : [...prev, adminId];
      localStorage.setItem("selectedAdmins", JSON.stringify(updated));
      return updated;
    });
  };

  // Lọc danh sách admin dựa vào bộ lọc
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = [admin.name, admin.gmail, admin.phoneNumber].some(
      field => String(field).toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    
    return (
      matchesSearch &&
      (roleFilter === "" || admin.role === roleFilter) &&
      (statusFilter === "" || admin.status === statusFilter) &&
      (genderFilter === "" || admin.gender === genderFilter)
    );
  });

  //Tính toán số lượng hiển thị
  const availableOptions = [10, 20, 30].filter(num => num <= filteredAdmins.length);
  if (filteredAdmins.length > 0 && !availableOptions.includes(filteredAdmins.length)) {
    availableOptions.push(filteredAdmins.length);
  }

  //Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, genderFilter, searchTerm]);

  // Tính toán phân trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredAdmins.length / displayCount);
  console.log("Total Pages:", filteredAdmins.length," ", displayCount);
  const startIndex = (currentPage - 1) * displayCount;
  const currentAdmins = displayCount === filteredAdmins.length 
    ? filteredAdmins 
    : filteredAdmins.slice(startIndex, startIndex + displayCount);

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

  //Xử lý mở modal khi xem thông tin admin
  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  // Hàm xử lý thêm admin
  const handleAddAdmin = async (adminData) => {
    try {
      const response = await axios.post('https://dhkshop.onrender.com/admins', adminData);
      
      // Kiểm tra response và cấu trúc dữ liệu
      if (!response.data?.admin) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
  
      // Thêm admin mới vào danh sách
      setAdmins(prev => [...prev, response.data.admin]);
      
      // Reset form
      setNewAdmin({
        username: '',
        name: '',
        password: '',
        role: 'admin',
        gmail: '',
        phoneNumber: '',
        address: '',
        gender: 'male'
      });
  
      enqueueSnackbar('Thêm admin thành công!', { variant: 'success' });
  
    } catch (error) {
      // Xử lý lỗi chi tiết
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  };

  // Hàm xử lý sửa admin
  const handleEditAdmin = async (adminData) => {
    try {
      const response = await axios.put(`https://dhkshop.onrender.com/admins/edit/${adminData._id}`, adminData);
      
      if (!response.data?.admin) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
  
      // Cập nhật danh sách admin
      setAdmins(prev => prev.map(admin => 
        admin._id === adminData._id ? response.data.admin : admin
      ));
  
      enqueueSnackbar('Cập nhật admin thành công!', { variant: 'success' });
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  };

  // Hàm xử lý xóa admin
  const handleDeleteAdmin = async (adminId) => {
    // Hiển thị alert xác nhận
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa admin này không?");
    
    if (!isConfirmed) return; // Nếu người dùng không đồng ý, thoát khỏi hàm

    try {
      // Gọi API xóa admin
      await axios.delete(`https://dhkshop.onrender.com/admins/${adminId}`);
      
      // Cập nhật danh sách admin sau khi xóa
      setAdmins(prev => prev.filter(admin => admin._id !== adminId));
      
      // Hiển thị thông báo thành công
      enqueueSnackbar('Xóa admin thành công!', { variant: 'success' });
    } catch (error) {
      // Xử lý lỗi
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

   // Hàm xử lý xóa nhiều admin
   const handleDeleteAllSelected = async () => {
    if (selectedAdmins.length === 0) {
      enqueueSnackbar("Vui lòng chọn ít nhất một admin để xóa!", { variant: "warning" });
      return;
    }

    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedAdmins.length} admin đã chọn không?`);
    if (!isConfirmed) return;

    try {
      let deletedAdmins = []; // Danh sách admin đã xóa thành công
      let notFoundAdmins = []; // Danh sách admin không tồn tại

      // Duyệt qua từng admin đã chọn và gọi API xóa
      for (const adminId of selectedAdmins) {
        try {
          await axios.delete(`https://dhkshop.onrender.com/admins/${adminId}`);
          deletedAdmins.push(adminId); // Thêm vào danh sách đã xóa thành công
        } catch (error) {
          if (error.response?.status === 404) {
            notFoundAdmins.push(adminId); // Admin không tồn tại
          } else {
            throw error; // Nếu có lỗi khác, hiển thị thông báo lỗi
          }
        }
      }

      // Cập nhật danh sách admin trên frontend
      setAdmins(prev => prev.filter(admin => 
        !deletedAdmins.includes(admin._id) && !notFoundAdmins.includes(admin._id)
      ));

      // Cập nhật danh sách đã chọn
      const updatedSelectedAdmins = selectedAdmins.filter(
        id => !deletedAdmins.includes(id) && !notFoundAdmins.includes(id)
      );
      setSelectedAdmins(updatedSelectedAdmins);
      localStorage.setItem("selectedAdmins", JSON.stringify(updatedSelectedAdmins));

      // Hiển thị thông báo kết quả
      if (deletedAdmins.length > 0) {
        enqueueSnackbar(`Đã xóa ${deletedAdmins.length} admin thành công!`, { variant: "success" });
      }
      if (notFoundAdmins.length > 0) {
        enqueueSnackbar(`${notFoundAdmins.length} admin không tồn tại và đã bị loại khỏi danh sách.`, { variant: "warning" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') || 
        error.message ||
        'Có lỗi xảy ra!';
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  //Copy
  const handleCopyTableData = () => {
    // Chuyển dữ liệu từ bảng thành chuỗi CSV
    const headers = ["Họ và tên", "Vai trò", "Trạng thái", "Giới tính", "Email", "Địa chỉ", "Số điện thoại"];
    const rows = currentAdmins.map(admin => [
      admin.name,
      admin.role === "admin" ? "Admin" : "Super Admin",
      admin.status === "active" ? "Hoạt động" : "Đã bị khoá",
      admin.gender === "male" ? "Nam" : admin.gender === "female" ? "Nữ" : "Khác",
      admin.gmail,
      admin.address || "Chưa cập nhật",
      admin.phoneNumber
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

  //Xuất file excel
  const exportToExcel = (admins) => {
    if (admins.length === 0) {
      enqueueSnackbar("Không có dữ liệu để xuất!", { variant: "warning" });
      return;
    }
  
    // 1. Chuẩn bị dữ liệu dưới dạng mảng JSON
    const data = admins.map(admin => ({
      "Họ và tên": admin.name,
      "Vai trò": admin.role === "admin" ? "Admin" : "Super Admin",
      "Trạng thái": admin.status === "active" ? "Hoạt động" : "Đã bị khoá",
      "Giới tính": admin.gender === "male" ? "Nam" : admin.gender === "female" ? "Nữ" : "Khác",
      "Email": admin.gmail,
      "Địa chỉ": admin.address || "Chưa cập nhật",
      "Số điện thoại": admin.phoneNumber
    }));
  
    // 2. Chuyển dữ liệu thành worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // 3. Tạo workbook và thêm worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách Admin");
  
    // 4. Xuất file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // 5. Lưu file
    saveAs(excelFile, "Danh_sach_Admin.xlsx");
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 bg-white pl-3 border-l-4 border-[#008500] h-9 flex items-center rounded-lg justify-between pr-3">
        Danh sách Admin
        <Clock />
      </h2>
      
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex gap-2 flex-wrap">
          <button 
            className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
            onClick={() => setIsAddModalOpen(true)}
          >
            ➕ Thêm admin mới
          </button>
          <button 
            className="bg-indigo-400 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            onClick={handleCopyTableData}
          >
            📋 Sao chép
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            onClick={() => exportToExcel(admins)}
          >
            📊 Xuất Excel
          </button>
          {selectedAdmins.length > 0 && (
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
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
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
                  {num === filteredAdmins.length ? "Tất cả" : num}
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
                <th className="border-t border-b border-gray-300 p-2">Họ và tên</th>
                <th className="border-t border-b border-gray-300 p-2">
                  <select 
                    className="w-full p-1 bg-white border rounded" 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </th>
                <th className="border-t border-b border-gray-300 p-2">
                  <select 
                    className="w-full p-1 bg-white border rounded" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="banned">Đã bị khoá</option>
                  </select>
                </th>
                <th className="border-t border-b border-gray-300 p-2">
                  <select 
                    className="w-full p-1 bg-white border rounded" 
                    value={genderFilter} 
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </th>
                <th className="border-t border-b border-gray-300 p-2">Email</th>
                <th className="border-t border-b border-gray-300 p-2">Số điện thoại</th>
                <th className="border-t border-b border-gray-300 p-2">Các chức năng</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
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
                      Không tìm thấy admin nào phù hợp
                    </div>
                  </td>
                </tr>
              ) : (
                currentAdmins.map((admin, index) => (
                  <tr key={admin._id} className="border-t border-b border-gray-300">
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedAdmins.includes(admin._id)}
                        onChange={() => handleCheckboxChange(admin._id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={admin.name}
                        onClick={() => handleViewAdmin(admin)}
                      >
                        {admin.name.length > 20 ? admin.name.slice(0, 20) + "..." : admin.name}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {admin.role === "admin" ? "Admin" : "Super Admin"}
                    </td>
                    <td className={`border-t border-b border-gray-300 p-2 text-center font-medium
                        ${admin.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}
                      `}
                    >
                      {admin.status === "active" ? "Hoạt động" : "Đã bị khoá"}
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {admin.gender === "male" ? "Nam" : admin.gender === "female" ? "Nữ" : "Khác"}
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      <span
                        className="inline-block max-w-[140px] truncate cursor-pointer"
                        title={admin.gmail}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(admin.gmail);
                            enqueueSnackbar("Đã copy email vào clipboard!", { variant: "success" });
                          } catch (err) {
                            enqueueSnackbar("Đã có lỗi xảy ra!", { variant: "error" });
                          }
                        }}
                      >
                        {admin.gmail.length > 20 ? admin.gmail.slice(0, 20) + "..." : admin.gmail}
                      </span>
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center">
                      {admin.phoneNumber}
                    </td>
                    <td className="border-t border-b border-gray-300 p-2 text-center space-x-2">
                    <button 
                      onClick={() => handleViewAdmin(admin)}
                    >
                      👁
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAdminForEdit(admin);
                        setIsEditModalOpen(true);
                      }}
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => handleDeleteAdmin(admin._id)}
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
          <ViewAdminModal 
            admin={selectedAdmin} 
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {isAddModalOpen && (
          <CreateAdminModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAdmin}
            initialData={newAdmin}
          />
        )}
        {isEditModalOpen && (
          <EditAdminModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditAdmin}
            initialData={selectedAdminForEdit}
          />
        )}
        {totalPages > 1 && displayCount < filteredAdmins.length && (
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

export default AdminManagement;