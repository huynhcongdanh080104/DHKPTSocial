import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
 //Trang shipper xem và cập nhật đơn hàng đang giao
const ShipperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [shipper, setShipper] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/shipper-login');
      return;
    }

    // Lấy thông tin shipper
    axios.get(`https://dhkshop.onrender.com/shipper/profile/${Cookies.get('shipperId')}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setShipper(res.data);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi lấy thông tin shipper', { variant: 'error' });
      });

    // Lấy danh sách đơn của shipper
    axios.get('https://dhkshop.onrender.com/orders/myorders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi tải đơn hàng', { variant: 'error' });
      });
  }, []);

  const handleUpdateStatus = (orderId) => {
    const token = Cookies.get('token');
    axios.put(`https://dhkshop.onrender.com/orders/${orderId}/update-status`, {
      status: 'delivered'
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        enqueueSnackbar('Đã cập nhật trạng thái đơn hàng', { variant: 'success' });
        setOrders(prev => prev.filter(o => o._id !== orderId));
      })
      .catch(() => {
        enqueueSnackbar('Cập nhật trạng thái thất bại', { variant: 'error' });
      });
  };

  const goToDashboard = () => {
    navigate('/shipper/dashboard');
  };

  if (!shipper) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Đơn đang giao</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">Không có đơn hàng nào.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-700">Mã đơn: {order._id}</p>
                <p>Khách hàng: {order.customerName}</p>
                <p>Địa chỉ: {order.customerAddress}</p>
                <p>SĐT: {order.customerPhone}</p>
                <p>Trạng thái: <span className="text-blue-600 font-semibold">{order.status}</span></p>
                <button
                  onClick={() => handleUpdateStatus(order._id)}
                  className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >Đã giao</button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={goToDashboard}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
          >Quay về Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;
