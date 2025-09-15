import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
//trang dành cho nhân viên quản lý kho (warehouseStaff), dùng để phân phối các đơn hàng chưa có shipper cho các shipper trong khu vực kho quản lý.
const AssignOrdersWarehouse = () => {
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/warehouse-login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, shippersRes] = await Promise.all([
          axios.get('https://dhkshop.onrender.com/warehouse/unassigned-orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://dhkshop.onrender.com/warehouse/shippers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setOrders(ordersRes.data);
        setShippers(shippersRes.data);
      } catch (error) {
        enqueueSnackbar('Lỗi khi tải dữ liệu', { variant: 'error' });
      }
    };

    fetchData();
  }, [enqueueSnackbar, navigate]);

  const handleAssign = async (orderId) => {
    const shipperId = selectedShipper[orderId];
    if (!shipperId) {
      enqueueSnackbar('Vui lòng chọn shipper', { variant: 'warning' });
      return;
    }

    const token = Cookies.get('token');
    try {
      await axios.post(
        'https://dhkshop.onrender.com/warehouse/assignorder',
        { orderId, shipperId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar('Phân phối thành công', { variant: 'success' });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      enqueueSnackbar('Phân phối thất bại', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Phân phối Đơn hàng</h1>
          <Link to="/warehouse/dashboard" className="text-blue-500 hover:underline">
            Quay lại Dashboard
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">Không có đơn hàng cần phân phối</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Mã đơn</th>
                <th className="border px-4 py-2">Người nhận</th>
                <th className="border px-4 py-2">Địa chỉ</th>
                <th className="border px-4 py-2">Chọn shipper</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">{order.recipientName}</td>
                  <td className="border px-4 py-2">{order.recipientAddress}</td>
                  <td className="border px-4 py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={selectedShipper[order._id] || ''}
                      onChange={(e) =>
                        setSelectedShipper((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">-- Chọn --</option>
                      {shippers.map((shipper) => (
                        <option key={shipper._id} value={shipper._id}>
                          {shipper.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleAssign(order._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Phân phối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssignOrdersWarehouse;
