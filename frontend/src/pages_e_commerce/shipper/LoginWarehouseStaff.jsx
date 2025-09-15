import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

import Spiner from '/src/components/Spiner';
import LogoSvg from '/src/components/svgs/DHKPTSocial';
//dang nhap warehousestaff 
//login-dashboard-warehouseshipper|warehouseorder-assignorderswarehouse
const LoginWarehouseStaff = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
    if (!username || !password) {
      enqueueSnackbar('Vui lòng nhập đầy đủ thông tin', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://dhkshop.onrender.com/loginwarehousestaff', {
        username,
        password,
      });

      const { token, warehouseStaff } = response.data;

      if (warehouseStaff.status === 'Banned') {
        enqueueSnackbar('Tài khoản của bạn đã bị khóa', { variant: 'error' });
        setLoading(false);
        return;
      }

      Cookies.set('token', token, { expires: 7 }); // Lưu token 7 ngày
      Cookies.set('warehouseStaffId', warehouseStaff._id, { expires: 1 });
      Cookies.set('warehouseStaffName', warehouseStaff.name, { expires: 1 });

      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
      setLoading(false);
      navigate('/warehousedashboard'); // Đổi sang route phù hợp
    } catch (error) {
      enqueueSnackbar('Sai tên đăng nhập hoặc mật khẩu', { variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 flex">
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div className="w-2/3 h-32 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-xl shadow-xl flex items-center justify-center">
          <LogoSvg className="lg:w-2/3 fill-black" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-pink-600">
            Đăng nhập Nhân viên Kho
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Quản lý hệ thống giao nhận
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-yellow-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform transition-all hover:scale-105"
                >
                  {loading ? <Spiner /> : 'Đăng nhập'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWarehouseStaff;
