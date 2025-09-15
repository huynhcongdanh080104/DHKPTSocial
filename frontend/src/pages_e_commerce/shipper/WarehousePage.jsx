import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
//Kho hàng cho shipper
const WarehousePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/shipper-login');
      return;
    }

    axios.get('https://dhkshop.onrender.com/shipper/warehouseorders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi tải đơn hàng', { variant: 'error' });
        setLoading(false);
      });
  }, []);

  const handleAcceptOrder = (orderId) => {
    const token = Cookies.get('token');
    axios.post(`https://dhkshop.onrender.com/shipper/acceptorder/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        enqueueSnackbar('Nhận đơn thành công', { variant: 'success' });
        setOrders(orders.filter(order => order._id !== orderId));
        navigate('/shipperorders');  // điều hướng sau khi nhận đơn
      })
      .catch(() => {
        enqueueSnackbar('Nhận đơn thất bại', { variant: 'error' });
      });
  };

  const goBackDashboard = () => {
    navigate('/shipperdashboard');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Kho hàng - Danh sách đơn</h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">Không có đơn hàng nào trong kho.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded-lg bg-gray-50">
                <p><span className="font-semibold">Mã đơn:</span> {order._id}</p>
                <p><span className="font-semibold">Khách hàng:</span> {order.recipientName}</p>
                <p><span className="font-semibold">Địa chỉ:</span> {order.recipientAddress}</p>
                <button
                  onClick={() => handleAcceptOrder(order._id)}
                  className="mt-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg"
                >Nhận đơn</button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={goBackDashboard}
          className="mt-6 px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg"
        >Quay lại Dashboard</button>
      </div>
    </div>
  );
};

export default WarehousePage;
