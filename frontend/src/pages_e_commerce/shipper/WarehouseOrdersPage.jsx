import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
//dùng để tiếp nhận đơn hàng từ transmiter.
//chua gan vao dau
const WarehouseOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/warehouse/login');
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAcceptOrder = (orderId) => {
    const token = Cookies.get('token');
    axios.put(`https://dhkshop.onrender.com/warehouse/orders/${orderId}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        enqueueSnackbar('Đã tiếp nhận đơn hàng', { variant: 'success' });
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'accepted' } : order));
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi tiếp nhận đơn hàng', { variant: 'error' });
      });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh sách đơn hàng từ Transmiter</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">Không có đơn hàng nào.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Mã đơn</th>
                <th className="p-2 border">Người nhận</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{order._id}</td>
                  <td className="p-2 border">{order.recipientName}</td>
                  <td className="p-2 border">{order.status === 'accepted' ? 'Đã tiếp nhận' : 'Chờ tiếp nhận'}</td>
                  <td className="p-2 border">
                    {order.status !== 'accepted' && (
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >Tiếp nhận</button>
                    )}
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

export default WarehouseOrdersPage;
