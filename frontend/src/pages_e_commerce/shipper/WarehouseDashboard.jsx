import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
//trang chu cua warehousestaff
const DashboardWarehouseStaff = () => {
  const [staff, setStaff] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/warehouse-login');
      return;
    }

    axios.get('https://dhkshop.onrender.com/warehousestaff', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setStaff(res.data);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi lấy thông tin nhân viên kho', { variant: 'error' });
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/warehouse-login');
  };

  const goToShippers = () => {
    navigate('/warehouseshippers');
  };

  const goToOrders = () => {
    navigate('/warehouseorders');
  };

  if (!staff) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Nhân Viên Kho</h1>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">Tên: {staff.name}</p>
          <p className="text-gray-600">Số điện thoại: {staff.phone}</p>
          <p className="text-gray-600">Kho khu vực: <span className="font-bold">{staff.warehouseArea}</span></p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={goToShippers}
            className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg"
          >Danh sách Shipper</button>
          <button
            onClick={goToOrders}
            className="px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg"
          >Đơn hàng đã tiếp nhận</button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg"
          >Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWarehouseStaff;
