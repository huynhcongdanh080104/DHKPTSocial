import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
//trang chu shipper
const DashboardShipper = () => {
  const [shipper, setShipper] = useState(null);
  const [status, setStatus] = useState('off'); // "idle", "delivering", "off"
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/shipper-login');
      return;
    }

    axios.get(`https://dhkshop.onrender.com/shipper/profile/${Cookies.get('shipperId')}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setShipper(res.data);
        setStatus(res.data.status); // status from backend: 'idle', 'delivering', 'off'
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi lấy thông tin shipper', { variant: 'error' });
      });
  }, []);

  const handleStatusChange = (newStatus) => {
    const token = Cookies.get('token');
    axios.put(`https://dhkshop.onrender.com/shipper/status/${Cookies.get('shipperId')}`, {
      status: newStatus,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setStatus(newStatus);
        enqueueSnackbar('Cập nhật trạng thái thành công', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('Cập nhật trạng thái thất bại', { variant: 'error' });
      });
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/shipper-login');
  };

  const goToWarehouse = () => {
    navigate('/warehousepage');//Kho hàng cho shipper
  };

  const goToOrders = () => {
    navigate('/shipperorders');
  };

  if (!shipper) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Shipper</h1>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">Tên: {shipper.name}</p>
          <p className="text-gray-600">Số điện thoại: {shipper.phone}</p>
          <p className="text-gray-600">Trạng thái hiện tại: <span className="font-bold">{status === 'idle' ? 'Rỗi' : status === 'delivering' ? 'Đang giao' : 'Tạm ngưng'}</span></p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleStatusChange('idle')}
            className={`px-4 py-2 rounded-lg text-white ${status === 'idle' ? 'bg-green-600' : 'bg-green-400 hover:bg-green-500'}`}
          >Rỗi</button>
          <button
            onClick={() => handleStatusChange('delivering')}
            className={`px-4 py-2 rounded-lg text-white ${status === 'delivering' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
          >Đang giao</button>
          <button
            onClick={() => handleStatusChange('off')}
            className={`px-4 py-2 rounded-lg text-white ${status === 'off' ? 'bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'}`}
          >Tạm ngưng</button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={goToWarehouse}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg"
          >Kho hàng</button>
          <button
            onClick={goToOrders}
            className="px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg"
          >Đơn đang giao</button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg"
          >Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardShipper;