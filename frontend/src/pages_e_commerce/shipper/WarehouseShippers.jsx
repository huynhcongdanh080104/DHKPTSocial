import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useNavigate, Link } from 'react-router-dom';
//Trang Danh sách Shipper trong khu vực
const WarehouseShippers = () => {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/warehouse-login');
      return;
    }

    axios.get('https://dhkshop.onrender.com/warehousestaff/shippers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setShippers(res.data);
      })
      .catch(() => {
        enqueueSnackbar('Lỗi khi tải danh sách shipper', { variant: 'error' });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh sách Shipper trong khu vực</h1>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Số điện thoại</th>
                <th className="p-2 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {shippers.map((shipper) => (
                <tr key={shipper._id} className="text-center">
                  <td className="p-2 border">{shipper.name}</td>
                  <td className="p-2 border">{shipper.phone}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${
                      shipper.status === 'idle' ? 'bg-green-500' :
                      shipper.status === 'delivering' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {shipper.status === 'idle' ? 'Rỗi' : shipper.status === 'delivering' ? 'Đang giao' : 'Tạm ngưng'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6">
          <Link to="/warehousedashboard" className="text-blue-500 hover:underline">Quay về Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default WarehouseShippers;
