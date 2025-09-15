import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useNavigate, Link } from 'react-router-dom';

// Trang quản lý danh sách đơn hàng tại kho dành cho nhân viên quản lý kho
const WarehouseOrders = () => {
  const [orders, setOrders] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/warehouse-login');
      return;
    }

    axios.get('https://dhkshop.onrender.com/warehouse/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi lấy danh sách đơn hàng', { variant: 'error' });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng tại kho</h1>
          <Link
            to="/warehousedashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >Quay lại Dashboard</Link>
        </div>

        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Mã đơn</th>
              <th className="border px-4 py-2">Người nhận</th>
              <th className="border px-4 py-2">Địa chỉ</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.recipientName}</td>
                <td className="border px-4 py-2">{order.recipientAddress}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/assignorderswarehouse/${order._id}`}//Phan cong 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Phân công
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">Chưa có đơn hàng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseOrders;
