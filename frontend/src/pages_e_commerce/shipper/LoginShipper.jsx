import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

//dang nhap shipper
//login-dashboard-warehousepage-shipperorder
import Spiner from '../../components/Spiner';
import LogoSvg from '../../components/svgs/DHKPTSocial';

const LoginShipper = () => {
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
      const response = await axios.post('https://dhkshop.onrender.com/auth/login-shipper', {
        username,
        password,
      });

      const { token, shipper } = response.data;

      if (shipper.status === 'Banned') {
        enqueueSnackbar('Tài khoản của bạn đã bị khóa', { variant: 'error' });
        setLoading(false);
        return;
      }

      Cookies.set('token', token, { expires: 7}); 

      Cookies.set('shipperId', shipper._id, { expires: 1 });
      Cookies.set('shipperName', shipper.name, { expires: 1 });

      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
      setLoading(false);
      navigate('/shipperdashboard'); 
    } catch (error) {
      enqueueSnackbar('Sai tên đăng nhập hoặc mật khẩu', { variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-indigo-100 flex">
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div className="w-2/3 h-32 bg-gradient-to-r from-green-500 to-indigo-500 rounded-xl shadow-xl flex items-center justify-center">
          <LogoSvg className="lg:w-2/3 fill-black" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-indigo-600">
            Đăng nhập Shipper
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Truy cập hệ thống giao hàng
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all hover:scale-105"
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

export default LoginShipper;
